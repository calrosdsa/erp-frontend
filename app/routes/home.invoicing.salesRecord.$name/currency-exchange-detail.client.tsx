import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";
import { NavItem } from "~/types";
import CostCenterInfo from "./tab/currency-exchange-info";
import { setUpToolbar, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { EventState, State, stateFromJSON } from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { ButtonToolbar } from "~/types/actions";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export default function CurrencyExchangeDetailClient() {
  const { currencyExchange, actions } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = routes;
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
      main: r.currencyExchange,
      routePrefix: [r.accountingM],
      routeSufix: [currencyExchange?.name || ""],
      q: {
        tab: tab,
        id: currencyExchange?.uuid || "",
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
      current_state: currencyExchange?.status || "",
      party_id: currencyExchange?.uuid || "",
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

 useDisplayMessage({
    error:fetcher.data?.error,
    success:fetcher.data?.message,
 },[fetcher.data])

  setUpToolbar(() => {
    const state = stateFromJSON(currencyExchange?.status);
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
      status: stateFromJSON(currencyExchange?.status),
      actions: actions,
    };
  }, [currencyExchange, permission]);
  return (
    <DetailLayout partyID={currencyExchange?.id} navItems={navItems}>
      {tab == "info" && <CostCenterInfo />}
    </DetailLayout>
  );
}
