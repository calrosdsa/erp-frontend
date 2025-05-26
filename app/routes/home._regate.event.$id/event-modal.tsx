import { useFetcher, useSearchParams } from "@remix-run/react";
import { action, loader } from "./route";
import { useTranslation } from "react-i18next";
import EventInfoTab from "./tab/event-info";
import { useEffect, useState } from "react";
import { route } from "~/util/route";
import EventConnectionsTab from "./tab/event-connections";
import { useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { EventState, State, stateFromJSON } from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { ButtonToolbar } from "~/types/actions";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import TabNavigation from "@/components/ui/custom/tab-navigation";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import ModalLayout, {
  setUpModalPayload,
} from "@/components/ui/custom/modal-layout";
import { SerializeFrom } from "@remix-run/node";
import { useEventStore } from "./event-store";
import { DEFAULT_ID, LOADING_MESSAGE } from "~/constant";
import { toast } from "sonner";

export default function EventModal({
  appContext,
}: {
  appContext: GlobalState;
}) {
  const key = route.event;
  const [data, setData] = useState<SerializeFrom<typeof loader>>();
  const event = data?.event;
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const [permission] = usePermission({
    actions: data?.actions,
    roleActions: appContext.roleActions,
  });
  const fetcher = useFetcher<typeof action>();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("common");
  const r = route;
  const [open, setOpen] = useState(true);
  const eventID = searchParams.get(route.event);
  const eventStore = useEventStore();
  const [toastID, setToastID] = useState<string | number>();

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(route.toRouteDetail(route.event, eventID));
      if (res.ok) {
        const body = (await res.json()) as SerializeFrom<typeof loader>;
        setData(body);
        console.log("BODY", body);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if(eventID){
      load();
    }
  }, [eventID]);

  const onChangeState = (e: EventState) => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
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

  setUpModalPayload(
    key,
    () => {
      const state = stateFromJSON(event?.status);
      const isNew = eventID == DEFAULT_ID;
      let actions: ButtonToolbar[] = [];
      if (permission.edit && state == State.ENABLED) {
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
        title: isNew ? "Nuevo Evento" : event?.name,
        status: stateFromJSON(event?.status),
        actions: actions,
        enableEdit: isNew,
        isNew: isNew,
        onCancel: isNew
          ? () => {
              setOpen(false);
            }
          : undefined,
      };
    },
    [data, permission]
  );

  useDisplayMessage(
    {
      toastID: toastID,
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        load();
      },
    },
    [fetcher.data]
  );

  const closeModal = () => {
    eventStore.reset();
    searchParams.delete(route.event);
    searchParams.delete("tab");
    searchParams.delete("action");
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };

  useEffect(() => {
    if (!open) {
      closeModal();
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
      {loading && !data ? (
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
                    <EventInfoTab
                      appContext={appContext}
                      data={data}
                      load={load}
                      closeModal={() => setOpen(false)}
                      permission={permission}
                      // closeModal={closeModal}
                    />
                  ),
                },
                {
                  label: "Conexiones",
                  value: "connections",
                  children: <EventConnectionsTab data={data} />,
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
