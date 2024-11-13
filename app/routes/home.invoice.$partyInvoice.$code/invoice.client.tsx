import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { useEffect } from "react";
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
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { routes } from "~/util/route";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import DetailLayout from "@/components/layout/detail-layout";
import InvoiceInfoTab from "./components/tab/invoice-info";
import InvoiceConnectionsTab from "./components/tab/invoice-connections";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ActionToolbar } from "~/types/actions";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { PlusIcon } from "lucide-react";
import { sumTotal } from "~/util/format/formatCurrency";
import { useCreatePayment } from "../home.accounting.payment.new/use-create-payment";
import { useStatus } from "~/util/hooks/data/useStatus";
import { format } from "date-fns";

export default function InvoiceDetailClient() {
  const { actions, invoice, activities, associatedActions, itemLines, totals } =
    useLoaderData<typeof loader>();
  const toolbarState = useToolbar();
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const params = useParams();
  const partyInvoice = params.partyInvoice || "";
  const [searchParams] = useSearchParams();
  const globalState = useOutletContext<GlobalState>();
  const tab = searchParams.get("tab");
  const r = routes;
  const navigate = useNavigate();
  const [paymentPermission] = usePermission({
    actions: associatedActions && associatedActions[PartyType.payment],
    roleActions: globalState.roleActions,
  });
  const createPayment = useCreatePayment();
  const { enabledOrder } = useStatus({
    status: stateFromJSON(invoice?.status),
  });

  const navItems = [
    {
      title: t("info"),
      href: r.toRoute({
        main: partyInvoice,
        routePrefix: ["invoice"],
        routeSufix: [invoice?.code || ""],
        q: {
          tab: "info",
        },
      }),
    },
    {
      title: t("connections"),
      href: r.toRoute({
        main: partyInvoice,
        routePrefix: ["invoice"],
        routeSufix: [invoice?.code || ""],
        q: {
          tab: "connections",
        },
      }),
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

  setUpToolbar(() => {
    let actions: ActionToolbar[] = [];
    const status = stateFromJSON(invoice?.status)
    actions.push({
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
    if (paymentPermission?.create && enabledOrder && status != State.PAID) {
      actions.push({
        label: t("_payment.base"),
        onClick: () => {
          const outstanding = Number(totals?.total) - Number(totals?.paid);
          createPayment.setData({
            amount: outstanding,
            partyUuid: invoice?.party_uuid,
            partyType: invoice?.party_type,
            partyName: invoice?.party_name,
            partyReference: invoice?.id,
            paymentType: getPaymentType(partyInvoice),
            partyReferences: [
              {
                partyType: partyInvoice,
                partyName: invoice?.code || "",
                partyID: Number(invoice?.id),
                grandTotal: Number(totals?.total),
                outstanding: outstanding,
                allocated: Number(totals?.total) - Number(totals?.paid),
              },
            ],
          });
          navigate(
            r.toRoute({
              main: partyTypeToJSON(PartyType.payment),
              routePrefix: [r.accountingM],
              routeSufix: ["new"],
            })
          );
        },
        Icon: PlusIcon,
      });
    }
    return {
      title: `${t("_invoice.base")}(${invoice?.code})`,
      status: stateFromJSON(invoice?.status),
      actions: actions,
      onChangeState: (e) => {
        const body: z.infer<typeof updateStateWithEventSchema> = {
          current_state: invoice?.status || "",
          party_type: params.partyInvoice || "",
          party_id: invoice?.code || "",
          events: [e],
        };
        fetcher.submit(
          {
            action: "update-state-with-event",
            updateStateWithEvent: body,
          },
          {
            method: "POST",
            encType: "application/json",
          }
        );
      },
    };
  }, [paymentPermission, invoice]);

  useEffect(() => {
    if (fetcher.state == "submitting") {
      toolbarState.setLoading(true);
    } else {
      toolbarState.setLoading(false);
    }
  }, [fetcher.state]);

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
    </DetailLayout>
  );
}
