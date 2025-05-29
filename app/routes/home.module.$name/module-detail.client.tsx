import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { route } from "~/util/route";
import { party } from "~/util/party";
import { useTranslation } from "react-i18next";
import { NavItem } from "~/types";
import ModuleInfo from "./tab/module-info";
import { setUpToolbarDetailPage } from "~/util/hooks/ui/useSetUpToolbar";
import { EventState, State, stateFromJSON } from "~/gen/common";
import { UpdateStatusWithEventType } from "~/util/data/schemas/base/base-schema";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { ButtonToolbar } from "~/types/actions";
import { Entity } from "~/types/enums";

export default function ModuleDetailClient() {
  const { module, sections, activities, actions } =
    useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const r = route;
  const p = party;
  const fetcher = useFetcher<typeof action>();
  const status = stateFromJSON(module?.status);
  const { roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    roleActions,
    actions,
  });
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: p.module,
      routePrefix: [r.accountingM],
      routeSufix: [module?.label || ""],
      q: {
        tab: tab,
        id: module?.uuid || "",
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
    console.log("ON CHANGE STATE", e);
    const body: UpdateStatusWithEventType = {
      current_state: module?.status || "",
      party_id: module?.id.toString() || "",
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

  setUpToolbarDetailPage(
    (opts) => {
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
        ...opts,
        titleToolbar: module?.label,
        status: status,
        actions: actions,
      };
    },
    [module]
  );

  return (
    <DetailLayout
      entityID={Entity.MODULE}
      activities={activities}
      partyID={module?.id}
      fullWidth={true}
      navItems={navItems}
    >
      {tab == "info" && <ModuleInfo />}
    </DetailLayout>
  );
}
