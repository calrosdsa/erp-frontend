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
import {
  setUpToolbarDetailPage,
  setUpToolbarRegister,
} from "~/util/hooks/ui/useSetUpToolbar";
import { ButtonToolbar } from "~/types/actions";
import BankAccountInfo from "./tab/bank-account-info";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { Entity } from "~/types/enums";

export default function BankAccountDetailClient() {
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
      routeSufix: [entity?.account_name || ""],
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

  setUpToolbarRegister(() => {
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
      titleToolbar: entity?.account_name,
      status: status,
      actions: actions,
    };
  }, [entity]);

  return (
    <DetailLayout
      activities={activities}
      partyID={entity?.id}
      navItems={navItems}
      partyName={entity?.account_name}
      entityID={Entity.BANK_ACCOUNT}
    >
      {tab == "info" && <BankAccountInfo />}
    </DetailLayout>
  );
}
