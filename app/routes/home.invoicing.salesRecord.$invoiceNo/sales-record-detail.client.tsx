import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { NavItem } from "~/types";
import CostCenterInfo from "./tab/sales-record-info";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { EventState, State, stateFromJSON } from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { ButtonToolbar } from "~/types/actions";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { Entity } from "~/types/enums";

export default function SalesRecordDetailClient() {
  const { salesRecord, actions, activities } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = route;
  const fetcher = useFetcher<typeof action>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    roleActions,
    actions,
  });
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.salesRecord,
      routePrefix: [r.invoicing],
      routeSufix: [salesRecord?.invoice_no || ""],
      q: {
        tab: tab,
        id: salesRecord?.uuid || "",
      },
    });
  };

  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
  ];

  const onChangeState = (e: EventState) => {
    const body: z.infer<typeof updateStatusWithEventSchema> = {
      current_state: salesRecord?.status || "",
      party_id: salesRecord?.uuid || "",
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

  setUpToolbar(() => {
    const state = stateFromJSON(salesRecord?.status);
    let actions: ButtonToolbar[] = [];
    if (permission.edit && state == State.ENABLED) {
      actions.push({
        label: "Deshabilitar",
        onClick: () => {
          onChangeState(EventState.DISABLED_EVENT);
        },
      });
    }
    if (permission.edit && state == State.DISABLED) {
      actions.push({
        label: "Habilitar Evento",
        onClick: () => {
          onChangeState(EventState.ENABLED_EVENT);
        },
      });
    }
    return {
      status: stateFromJSON(salesRecord?.status),
      actions: actions,
      titleToolbar: `Nº de la Factura(${salesRecord?.invoice_no})`,
      onChangeState: onChangeState,
    };
  }, [salesRecord, permission]);
  return (
    <DetailLayout
      partyID={salesRecord?.id}
      navItems={navItems}
      entityID={Entity.SALES_RECORD}
      activities={activities}
      partyName={salesRecord?.invoice_code}
    >
      {tab == "info" && <CostCenterInfo />}
    </DetailLayout>
  );
}
