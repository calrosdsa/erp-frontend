import { useFetcher, useLoaderData, useOutletContext, useSearchParams } from "@remix-run/react";
import { action, loader } from "./route";
import { useTranslation } from "react-i18next";
import DetailLayout from "@/components/layout/detail-layout";
import EventInfoTab from "./tab/event-info";
import { useEffect, useState } from "react";
import { NavItem } from "~/types";
import { route } from "~/util/route";
import EventConnectionsTab from "./tab/event-connections";
import { setUpToolbar, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { EventState, State, stateFromJSON } from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { ButtonToolbar } from "~/types/actions";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";

export default function EventDetailClient() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const {roleActions} = useOutletContext<GlobalState>()
  const { event, actions, activities } = useLoaderData<typeof loader>();
  const [eventPerm]= usePermission({
    actions,roleActions,
  })
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const r = route;
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const setUpNavItems = () => {
    if (event) {
      let tabs: NavItem[] = [
        { title: t("info"), href: r.toEventDetail(event.name, event.uuid) },
        {
          title: t("connections"),
          href: r.toEventDetail(event.name, event.uuid, "connections"),
        },
      ];
      setNavItems(tabs);
    }
  };

  const onChangeState = (e: EventState)=>{
    const body: z.infer<typeof updateStatusWithEventSchema> = {
        current_state: event?.status || "",
        party_id: event?.uuid || "",
        events: [e],
      };
      fetcher.submit(
        {
          action: "update-status-with-event",
          updateStatusWithEvent: body,
        },
        {
          method: "POST",
          encType: "application/json",
        }
      );
  }

  setUpToolbar(() => {
    const state = stateFromJSON(event?.status)
    let actions:ButtonToolbar[] =[]
    if(eventPerm.edit && state == State.ENABLED) {
        actions.push({
            label:"Completar Evento",
            onClick:()=>{
                onChangeState(EventState.COMPLETED_EVENT)
            }
        })
        actions.push({
            label:"Cancelar Evento",
            onClick:()=>{
                onChangeState(EventState.CANCEL_EVENT)
            }
        })
    }else {
        actions.push({
            label:"Habilitar Evento",
            onClick:()=>{
                onChangeState(EventState.ENABLED_EVENT)
            }
        })
    }
    
    return {
      status: stateFromJSON(event?.status),
      actions:actions
    };
  }, [event,eventPerm]);

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


  useEffect(() => {
    setUpNavItems();
  }, []);

  return (
    <DetailLayout
      partyID={event?.id}
      activities={activities}
      navItems={navItems}
    >
      {tab == "info" && <EventInfoTab />}
      {tab == "connections" && <EventConnectionsTab />}
    </DetailLayout>
  );
}
