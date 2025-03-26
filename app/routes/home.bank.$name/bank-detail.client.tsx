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
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";
import { NavItem } from "~/types";
import { UpdateStatusWithEventType } from "~/util/data/schemas/base/base-schema";
import { setUpToolbarDetailPage, setUpToolbarRegister } from "~/util/hooks/ui/useSetUpToolbar";
import { ButtonToolbar } from "~/types/actions";
import TermsAndConditionsInfo from "./tab/bank-info";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { Entity } from "~/types/enums";
import BankInfoTab from "./tab/bank-info";
import TabNavigation from "@/components/ui/custom/tab-navigation";

export default function BankDetailClient() {
  const { entity, activities, actions } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const [searchParams,setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const fetcher = useFetcher<typeof action>();
  const status = stateFromJSON(entity?.status);
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    roleActions,
    actions,
  });
  const toRoute = (tab: string) => {
    return route.toRoute({
      main: route.bank,
      routeSufix: [entity?.name || ""],
      q: {
        tab: tab,
        id: entity?.id.toString() || "",
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
      party_id: entity?.uuid || "",
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
      let actions: ButtonToolbar[] = [];
      if (permission.edit && status == State.ENABLED) {
        actions.push({
          label: "Deshabilitar",
          onClick: () => {
            onChangeState(EventState.DISABLED_EVENT);
          },
        });
      }
      if (permission.edit && status == State.DISABLED) {
        actions.push({
          label: "Habilitar",
          onClick: () => {
            onChangeState(EventState.ENABLED_EVENT);
          },
        });
      }
      return {
        titleToolbar: entity?.name,
        status: status,
        actions: actions,
      };
    },
    [entity]
  );

  return (
    <DetailLayout
      activities={activities}
      partyID={entity?.id}
      navItems={navItems}
      partyName={entity?.name}
      entityID={Entity.BANK}
    >
      {tab == "info" &&
      <BankInfoTab/>
      }
      
    </DetailLayout>
  );
}
