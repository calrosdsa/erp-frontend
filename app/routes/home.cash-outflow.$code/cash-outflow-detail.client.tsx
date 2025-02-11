import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { useTranslation } from "react-i18next";
import { EventState, State, stateFromJSON } from "~/gen/common";
import { GlobalState } from "~/types/app";
import { useEntityPermission, usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";
import { NavItem } from "~/types";
import { UpdateStatusWithEventType } from "~/util/data/schemas/base/base-schema";
import {
  setUpToolbarDetailPage,
  setUpToolbarRegister,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import CashOutflowInfoTab from "./tab/cash-outflow-info";
import CashOutflowDefaultsTab from "./tab/cash-outflow-defaults";
import { Entity } from "~/types/enums";
import { ButtonToolbar } from "~/types/actions";
import { format } from "date-fns";
import { useExporter } from "~/util/hooks/ui/useExporter";
import { DownloadIcon } from "lucide-react";
import { components } from "~/sdk";

export default function CashOutflowDetailClient() {
  const { entity, activities, actions, associatedActions } =
    useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const fetcher = useFetcher<typeof action>();
  const status = stateFromJSON(entity?.status);
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    roleActions,
    actions,
  });
  const entityPermissions = useEntityPermission({
    entities: associatedActions,
    roleActions,
  });
  const generalLedgerPerm = entityPermissions[Entity.GENERAL_LEDGER];
  const navigate = useNavigate();
  const params = useParams();
  const { exportPdf } = useExporter();
  const toRoute = (tab: string) => {
    return route.toRoute({
      main: route.cashOutflow,
      routeSufix: [entity?.code || ""],
      q: {
        tab: tab,
      },
    });
  };

  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
    {
      title: "Más información",
      href: toRoute("defaults"),
    },
  ];

  const onChangeState = (e: EventState) => {
    const body: UpdateStatusWithEventType = {
      current_state: entity?.status || "",
      party_id: entity?.code || "",
      events: [e],
    };
    fetcher.submit(
      {
        action: "update-status",
        updateStatus: body,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
    },
    [fetcher.data]
  );

  setUpToolbarRegister(() => {
    let actions: ButtonToolbar[] = [];
    let view: ButtonToolbar[] = [];
    if (generalLedgerPerm?.view) {
      view.push({
        label: t("accountingLedger"),
        onClick: () => {
          navigate(
            route.toRoute({
              main: "generalLedger",
              routePrefix: [route.accountingM],
              q: {
                fromDate: format(entity?.posting_date || "", "yyyy-MM-dd"),
                toDate: format(entity?.posting_date || "", "yyyy-MM-dd"),
                voucherNo: entity?.code,
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
          id: params.code || "",
        };
        exportPdf("/cash-outflow/export/document", exportData);
      },
    });
    return {
      actions:actions,
      view: view,
      status: status,
      onChangeState: onChangeState,
      // actions: actions,
    };
  }, [entity, generalLedgerPerm]);

  return (
    <DetailLayout
      activities={activities}
      partyID={entity?.id}
      navItems={navItems}
    >
      {tab == "info" && <CashOutflowInfoTab />}
      {tab == "defaults" && <CashOutflowDefaultsTab />}
    </DetailLayout>
  );
}
