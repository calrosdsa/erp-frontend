import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import ReceiptInfoTab from "./components/tab/receipt-info";
import { useTranslation } from "react-i18next";
import { State, stateFromJSON } from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import DetailLayout from "@/components/layout/detail-layout";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  setUpToolbarDetailPage,
  setUpToolbarRegister,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { route } from "~/util/route";
import ReceiptConnectionsTab from "./components/tab/receipt-connections";
import { format } from "date-fns";
import { ButtonToolbar } from "~/types/actions";
import { Entity } from "~/types/enums";
import { useExporter } from "~/util/hooks/ui/useExporter";
import { DownloadIcon } from "lucide-react";
import { components } from "~/sdk";
import ReceiptAddressAndContactTab from "./components/tab/receipt-address-and-contact";
import ReceiptTermsAndConditionsTab from "./components/tab/receipt-terms-and-conditions";
import ReceiptAccountsTab from "./components/tab/receipt-accounts";

export default function ReceiptDetailClient() {
  const { receipt, actions, activities, associatedActions } =
    useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const { t, i18n } = useTranslation("common");

  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const fetcher = useFetcher<typeof action>();
  const params = useParams();
  const partyReceipt = params.partyReceipt || "";
  const navigate = useNavigate();
  const r = route;
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
  const { exportPdf } = useExporter();
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: partyReceipt,
      routePrefix: [r.receiptM],
      routeSufix: [receipt?.code || ""],
      q: {
        tab: tab,
      },
    });
  };
  const navItems = [
    {
      title: t("info"),
      href: toRoute("info"),
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
      href: toRoute("connections"),
    },
  ];

  setUpToolbarRegister(() => {
    let view: ButtonToolbar[] = [];
    let actions: ButtonToolbar[] = [];

    const status = stateFromJSON(receipt?.status);
    const active = status != State.DRAFT && status != State.CANCELLED;
    if (gLPermission.view && active) {
      view.push({
        label: t("accountingLedger"),
        onClick: () => {
          navigate(
            r.toRoute({
              main: "generalLedger",
              routePrefix: [r.accountingM],
              q: {
                fromDate: format(receipt?.created_at || "", "yyyy-MM-dd"),
                toDate: format(receipt?.created_at || "", "yyyy-MM-dd"),
                voucherNo: receipt?.code,
              },
            })
          );
        },
      });
    }
    if (stockLedgerPerm.view && active) {
      view.push({
        label: t("stockLedger"),
        onClick: () => {
          navigate(
            r.toRoute({
              main: r.stockLedger,
              routePrefix: [r.stockM],
              q: {
                fromDate: format(receipt?.created_at || "", "yyyy-MM-dd"),
                toDate: format(receipt?.created_at || "", "yyyy-MM-dd"),
                voucherNo: receipt?.code,
              },
            })
          );
        },
      });
    }

    if (serialNoPermission?.view && active) {
      view.push({
        label: t("serialNoSumary"),
        onClick: () => {
          navigate(
            r.toRoute({
              main: r.serialNoResume,
              routePrefix: [r.stockM],
              q: {
                voucherNo: receipt?.code || "",
                fromDate: format(receipt?.posting_date || "", "yyyy-MM-dd"),
              },
            })
          );
        },
      });
    }
    actions.push({
      label: t("form.download"),
      Icon: DownloadIcon,
      onClick: () => {
        const exportData: components["schemas"]["ExportDocumentData"] = {
          party_type: partyReceipt,
          id: params.code || "",
        };
        exportPdf("/invoice/export/document", exportData);
      },
    });

    return {
      titleToolbar: `${t("_receipt.base")}(${receipt?.code})`,
      status: stateFromJSON(receipt?.status),
      view: view,
      onChangeState: (e) => {
        const body: z.infer<typeof updateStatusWithEventSchema> = {
          current_state: receipt?.status || "",
          party_type: params.partyReceipt || "",
          party_id: receipt?.code || "",
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
  }, [receipt, gLPermission, stockLedgerPerm, serialNoPermission]);

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
      activities={activities}
      partyID={receipt?.id}
      navItems={navItems}
    >
      {tab == "info" && <ReceiptInfoTab />}
      {tab == "connections" && <ReceiptConnectionsTab />}
      {tab == "address-and-contact" && <ReceiptAddressAndContactTab />}
      {tab == "terms-and-conditions" && <ReceiptTermsAndConditionsTab />}
      {tab == "accounts" && <ReceiptAccountsTab />}
    </DetailLayout>
  );
}
