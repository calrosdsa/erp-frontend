import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { useTranslation } from "react-i18next";
import DetailLayout from "@/components/layout/detail-layout";
import EventInfoTab from "./tab/event-info";
import { useEffect, useState } from "react";
import { route } from "~/util/route";
import EventConnectionsTab from "./tab/event-connections";
import {
  setUpToolbarRegister,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { EventState, State, stateFromJSON } from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { ButtonToolbar } from "~/types/actions";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import TabNavigation from "@/components/ui/custom/tab-navigation";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import ModalLayout, { setUpModalPayload } from "@/components/ui/custom/modal-layout";

export default function EventModal({
  appContext,
}: {
  appContext: GlobalState;
}) {
  const key = route.event
  const fetcherLoader = useFetcher<typeof loader>();
  const data = fetcherLoader.data;
  const event = data?.event;
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const [eventPerm] = usePermission({
    actions: data?.actions,
    roleActions: appContext.roleActions,
  });
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const r = route;
  const [open, setOpen] = useState(true);
  const eventID = searchParams.get(route.event);
  const initData = (tab: string) => {
    fetcherLoader.load(
      route.toRouteDetail(route.event, eventID || "", {
        tab: tab,
      })
    );
  };

  useEffect(() => {
    console.log("LOAD EVENT...");
    initData(tab);
  }, [tab]);

  const onChangeState = (e: EventState) => {
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
        action: route.toRouteDetail(route.event, event?.id.toString() || ""),
      }
    );
  };

  setUpModalPayload(key,() => {
    const state = stateFromJSON(event?.status);
    let actions: ButtonToolbar[] = [];
    if (eventPerm.edit && state == State.ENABLED) {
      actions.push({
        label: "Completar Evento",
        onClick: () => {
          onChangeState(EventState.COMPLETED_EVENT);
        },
      });
      actions.push({
        label: "Cancelar Evento",
        onClick: () => {
          onChangeState(EventState.CANCEL_EVENT);
        },
      });
    } else {
      actions.push({
        label: "Habilitar Evento",
        onClick: () => {
          onChangeState(EventState.ENABLED_EVENT);
        },
      });
    }

    return {
      status: stateFromJSON(event?.status),
      actions: actions,
    };
  }, [fetcherLoader.data, eventPerm]);

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
    if (!open) {
      searchParams.delete(route.event);
      searchParams.delete("tab");
      setSearchParams(searchParams, {
        preventScrollReset: true,
      });
    }
  }, [open]);
  return (
    <ModalLayout
      open={open}
      keyPayload={key}
      onOpenChange={(e) => {
        setOpen(e);
      }}
      title={event?.name || ""}
    >
      {fetcherLoader.state == "loading" && !fetcherLoader.data ? (
        <LoadingSpinner />
      ) : (
        <>
          {data && (
            <TabNavigation
              defaultValue={tab}
              onValueChange={(value) => {
                searchParams.set("tab", value);
                setSearchParams(searchParams, {
                  preventScrollReset: true,
                });
              }}
              items={[
                {
                  label: "Info",
                  value: "info",
                  children: (
                    <EventInfoTab appContext={appContext} data={data} />
                  ),
                },
                {
                  label: "Conexiones",
                  value: "connections",
                  children: <EventConnectionsTab 
                  data={data}
                  />,
                },
              ]}
            />
          )}
        </>
      )}
    </ModalLayout>
    // <DetailLayout
    //   partyID={event?.id}
    //   activities={activities}
    //   navItems={navItems}
    // >
    //   {tab == "info" && <EventInfoTab />}
    //   {tab == "connections" && <EventConnectionsTab />}
    // </DetailLayout>
  );
}
