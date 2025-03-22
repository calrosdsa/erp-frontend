import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { useTranslation } from "react-i18next";
import {
  PartyType,
  partyTypeFromJSON,
  partyTypeToJSON,
  PaymentType,
  paymentTypeToJSON,
  State,
  stateFromJSON,
} from "~/gen/common";
import { z } from "zod";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { route } from "~/util/route";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import DetailLayout from "@/components/layout/detail-layout";
import InvoiceInfoTab from "./components/tab/invoice-info";
import InvoiceConnectionsTab from "./components/tab/invoice-connections";
import {
  setUpToolbarRegister,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { ButtonToolbar } from "~/types/actions";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { DownloadIcon, PlusIcon } from "lucide-react";
import { useStatus } from "~/util/hooks/data/useStatus";
import { format } from "date-fns";
import { Entity } from "~/types/enums";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { useNewSalesRecord } from "../home.invoicing.salesRecord.new/use-new-sales-record";
import {  usePaymentStore } from "../home.payment.new/payment-store";
import { party } from "~/util/party";
import { usePurchaseRecordStore } from "../home.invoicing.purchaseRecord.new/purchase-record-store";
import InvoiceAddressAndContactTab from "./components/tab/invoice-address-and-contact";
import InvoiceTermsAndConditionsTab from "./components/tab/invoice-terms-and-conditions";
import InvoiceAccountsTab from "./components/tab/invoice-accounts";
import { components } from "~/sdk";
import { useExporter } from "~/util/hooks/ui/useExporter";
import { formatAmount } from "~/util/format/formatCurrency";

export default function InvoiceDetailClient() {
  const { invoice, activities, associatedActions, totals } =
    useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const params = useParams();
  const partyInvoice = params.partyInvoice || "";
  const [searchParams] = useSearchParams();
  const { roleActions } = useOutletContext<GlobalState>();
  const tab = searchParams.get("tab");
  const r = route;
  const p = party;
  const navigate = useNavigate();
  const [paymentPermission] = usePermission({
    actions: associatedActions && associatedActions[Entity.PAYMENT],
    roleActions: roleActions,
  });
  const [gLPermission] = usePermission({
    actions: associatedActions && associatedActions[Entity.GENERAL_LEDGER],
    roleActions: roleActions,
  });
  const [serialNoPermission] = usePermission({
    actions: associatedActions && associatedActions[Entity.SERIAL_NO],
    roleActions: roleActions,
  });

  const [stockLedgerPerm] = usePermission({
    actions: associatedActions && associatedActions[Entity.STOCK_LEDGER],
    roleActions: roleActions,
  });
  const [salesRecordPerm] = usePermission({
    actions: associatedActions && associatedActions[Entity.SALES_RECORD],
    roleActions,
  });
  const [purchaseRecordPerm] = usePermission({
    actions: associatedActions && associatedActions[Entity.PURCHASE_RECORD],
    roleActions,
  });

  const paymentStore = usePaymentStore();
  const { total } = useLineItems();
  const { total: totalTaxAndCharges } = useTaxAndCharges();
  const newSalesRecord = useNewSalesRecord();
  const purchaseRecordStore = usePurchaseRecordStore();
  const {exportPdf} = useExporter()

  const toRoute = (tab: string) => {
    return r.toRoute({
      main: partyInvoice,
      routePrefix:[r.invoiceM],
      routeSufix: [invoice?.code || ""],
      q: {
        tab: tab,
      },
    });
  };

  const navItems = [
    {
      title: t("info"),
      href:toRoute("info"),
    },
    {
      title: "Términos y Condiciones",
      href: toRoute("terms-and-conditions"),
    },
    {
      title: "Dirección y Contacto",
      href: toRoute("address-and-contact"),
    },
    {
      title: "Cuentas",
      href: toRoute("accounts"),
    },
    {
      title: t("connections"),
      href:toRoute("connections"),
    },
  ];

  const getPaymentType = (partyInvoice?: string): string => {
    switch (partyTypeFromJSON(partyInvoice)) {
      case PartyType.saleInvoice:
        return paymentTypeToJSON(PaymentType.RECEIVE);
        case PartyType.purchaseInvoice:
        return paymentTypeToJSON(PaymentType.PAY);
      default:
        return "";
      }
    };
    
 setUpToolbarRegister(()=>{
    let actions: ButtonToolbar[] = [];
    let view: ButtonToolbar[] = [];
    const status = stateFromJSON(invoice?.status);
    const active = status != State.DRAFT && status != State.CANCELLED;
    const activeInventory = active && invoice?.update_stock;
    if (gLPermission?.view) {
      view.push({
        label: t("accountingLedger"),
        onClick: () => {
          navigate(
            r.toRoute({
              main: "generalLedger",
              routePrefix: [r.accountingM],
              q: {
                fromDate: format(invoice?.created_at || "", "yyyy-MM-dd"),
                toDate: format(invoice?.created_at || "", "yyyy-MM-dd"),
                voucherNo: invoice?.code,
              },
            })
          );
        },
      });
    }
    if (paymentPermission?.create && active) {
      actions.push({
        label: t("_payment.base"),
        onClick: () => {
          const total = formatAmount(invoice?.total || 0);
          const outstanding = total - formatAmount(Number(totals?.paid));
          const b = {
            amount: outstanding,
            party: {
              uuid:invoice?.party_uuid,
              id:invoice?.party_id,
              name:invoice?.party_name
            },
            partyType: invoice?.party_type,
            partyReference: invoice?.id,
            paymentType: getPaymentType(partyInvoice),
            project:{
              id:invoice?.project_id,
              name:invoice?.project,
              uuid:invoice?.project_uuid,
            },
            costCenter:{
              id:invoice?.cost_center_id,
              name:invoice?.cost_center,
              uuid:invoice?.cost_center_uuid,
            },
            paymentReferences: [
              {
                partyType: partyInvoice,
                partyName: invoice?.code || "",
                partyID: Number(invoice?.id),
                grandTotal: total,
                outstanding: outstanding,
                allocated: total - Number(totals?.paid),
                currency:invoice?.currency || "",
              },
            ],
          }
          console.log("PAYMENT PAYLOAD",b)
          paymentStore.setPayload(b);
          navigate(
            r.toRoute({
              main: partyTypeToJSON(PartyType.payment),
              routeSufix: ["new"],
            })
          );
        },
        Icon: PlusIcon,
      });
    }
    if (serialNoPermission?.view && activeInventory) {
      view.push({
        label: t("serialNoSumary"),
        onClick: () => {
          navigate(
            r.toRoute({
              main: r.serialNoResume,
              routePrefix: [r.stockM],
              q: {
                voucherNo: invoice?.code || "",
                fromDate: format(invoice?.posting_date || "", "yyyy-MM-dd"),
              },
            })
          );
        },
      });
    }

    if (stockLedgerPerm?.view && activeInventory) {
      view.push({
        label: t("stockLedger"),
        onClick: () => {
          navigate(
            r.toRoute({
              main: r.stockLedger,
              routePrefix: [r.stockM],
              q: {
                fromDate: format(invoice?.posting_date || "", "yyyy-MM-dd"),
                toDate: format(invoice?.posting_date || "", "yyyy-MM-dd"),
                voucherNo: invoice?.code,
              },
            })
          );
        },
      });
    }
    if (salesRecordPerm?.view && active) {
      actions.push({
        label: t("salesRecord"),
        Icon: PlusIcon,
        onClick: () => {
          newSalesRecord.onPayload({
            partyID: invoice?.party_id,
            party: invoice?.party_name,
            invoiceCode: invoice?.code,
            invoiceID: invoice?.id,
          });
          navigate(
            r.toRoute({
              main: r.salesRecord,
              routePrefix: [r.invoicing],
              routeSufix: ["new"],
            })
          );
        },
      });
    }
    if (purchaseRecordPerm?.view && active) {
      actions.push({
        label: t("purchaseRecord"),
        Icon: PlusIcon,
        onClick: () => {
          purchaseRecordStore.setPayload({
            supplier_id: invoice?.party_id,
            supplier: invoice?.party_name,
            invoice: {
              name:invoice?.code,
              id:invoice?.id,
            },
            supplier_business_name:invoice?.party_name,
            subtotal:formatAmount(invoice?.total),
            total_purchase_amount:formatAmount(invoice?.total),
          });
          navigate(
            r.toRoute({
              main: p.purchaseRecord,
              routePrefix: [r.invoicing],
              routeSufix: ["new"],
            })
          );
        },
      });
    }
    actions.push({
      label:t("form.download"),
      Icon:DownloadIcon,
      onClick:()=>{
        const exportData:components["schemas"]["ExportDocumentData"] =  {
          party_type:partyInvoice,
          id:params.code || "",
        }
        exportPdf("/invoice/export/document",exportData)
      }
    })
    return {
      titleToolbar: `${t("_invoice.base")}(${invoice?.code})`,
      status: stateFromJSON(invoice?.status),
      actions: actions,
      view: view,
      onChangeState: (e) => {
        const body: z.infer<typeof updateStatusWithEventSchema> = {
          current_state: invoice?.status || "",
          party_type: params.partyInvoice || "",
          party_id: invoice?.code || "",
          events: [e],
        };
        fetcher.submit(
          {
            action: "update-status-with-event",
            updateStateWithEvent: body,
          },
          {
            method: "POST",
            encType: "application/json",
          }
        );
      },
    };
  },[
    paymentPermission,
    invoice,
    gLPermission,
    serialNoPermission,
    total,
    totalTaxAndCharges,
    stockLedgerPerm,
    salesRecordPerm,
    purchaseRecordPerm,
    t,
  ])


  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "STATE",
    },
    [fetcher.state]
  );

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
    },
    [fetcher.data]
  );
  return (
    <DetailLayout
      navItems={navItems}
      partyID={invoice?.id}
      activities={activities}
    >
      {tab == "info" && <InvoiceInfoTab />}
      {tab == "connections" && <InvoiceConnectionsTab />}
      {tab == "address-and-contact" && <InvoiceAddressAndContactTab />}
      {tab == "terms-and-conditions" && <InvoiceTermsAndConditionsTab />}
      {tab == "accounts" && <InvoiceAccountsTab />}
    </DetailLayout>
  );
}
