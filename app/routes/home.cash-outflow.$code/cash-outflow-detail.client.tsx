import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { useTranslation } from "react-i18next";
import { EventState, State, stateFromJSON } from "~/gen/common";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";
import { NavItem } from "~/types";
import { UpdateStatusWithEventType } from "~/util/data/schemas/base/base-schema";
import { setUpToolbarDetailPage, setUpToolbarRegister } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import CashOutflowInfoTab from "./tab/cash-outflow-info";

export default function CashOutflowDetailClient() {
  const { entity, activities, actions } = useLoaderData<typeof loader>();
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
  const toRoute = (tab: string) => {
    return route.toRoute({
      main: route.bankAccount,
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

  setUpToolbarRegister(
    () => {
      // let actions: ButtonToolbar[] = [];
      return {
        status: status,
        onChangeState:onChangeState,
        // actions: actions,
      };
    },
    [entity]
  );

  return (
    <DetailLayout
      activities={activities}
      partyID={entity?.id}
      navItems={navItems}
    >
      {tab == "info" && <CashOutflowInfoTab />}
    </DetailLayout>
  );
}
