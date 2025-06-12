import { useFetcher, useNavigate, useSearchParams } from "@remix-run/react";
import { action, loader } from "./route";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { ButtonToolbar } from "~/types/actions";
import { endOfMonth, format, startOfMonth } from "date-fns";
import {
  EventState,
  PartyType,
  partyTypeToJSON,
  State,
  stateFromJSON,
} from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import ModalLayout, {
  setUpModalPayload,
} from "@/components/ui/custom/modal-layout";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import TabNavigation from "@/components/ui/custom/tab-navigation";
import { DEFAULT_ID, LOADING_MESSAGE } from "~/constant";
import { SerializeFrom } from "@remix-run/node";

import { toast } from "sonner";
import { useItemStore } from "./item-store";
import ItemInfo from "./components/tab/item-info";
import ItemActivity from "./components/tab/item-activity";
import ItemConnections from "./components/tab/item-connections";
import ConnectionsEntity from "@/components/layout/connections-entity";
import { Entity } from "~/types/enums";

export default function ItemModal({ appContext }: { appContext: GlobalState }) {
  const key = route.item;

  const [data, setData] = useState<SerializeFrom<typeof loader>>();
  const [loading, setLoading] = useState(false);
  // const data = fetcherLoader.data;
  const item = data?.item;
  const [open, setOpen] = useState(true);
  // const { item, actions, activities } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState("info");

  const { t, i18n } = useTranslation("common");
  const itemID = searchParams.get(key);
  const [permission] = usePermission({
    roleActions: appContext.roleActions,
    actions: data?.actions,
  });
  const [toastID, setToastID] = useState<string | number>("");
  const itemStore = useItemStore();

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(route.toRouteDetail(route.item, itemID));
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
    if (itemID) {
      load();
    }
  }, [itemID]);

  const onChangeState = (e: EventState) => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    const body: z.infer<typeof updateStatusWithEventSchema> = {
      current_state: item?.status || "",
      party_id: item?.id.toString() || "",
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
        action: route.toRoute({
          main: route.item,
          routeSufix: [item?.id.toString() || ""],
        }),
      }
    );
  };

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

  setUpModalPayload(
    key,
    () => {
      const state = stateFromJSON(item?.status);
      const isNew = DEFAULT_ID == itemID;
      let view: ButtonToolbar[] = [];
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
          label: "Habilitar",
          onClick: () => {
            onChangeState(EventState.ENABLED_EVENT);
          },
        });
      }

      return {
        title: isNew ? "Nuevo dirección" : item?.name,
        view: isNew ? [] : view,
        actions: isNew ? [] : actions,
        status: stateFromJSON(item?.status),
        enableEdit: isNew,
        isNew: isNew,
        loadData: load,
        onCancel: isNew
          ? () => {
              setOpen(false);
            }
          : undefined,
      };
    },
    [data]
  );

  const closeModal = () => {
    itemStore.reset();
    searchParams.delete(route.item);
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
      keyPayload={key}
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
      }}
    >
      {loading && !data ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* {JSON.stringify(data?.item)} */}
          {data && (
            <TabNavigation
              defaultValue={tab}
              onValueChange={(value) => {
                setTab(value);
                // searchParams.set("tab", value);
                // setSearchParams(searchParams, {
                //   preventScrollReset: true,
                // });
              }}
              items={[
                {
                  label: "Info",
                  value: "info",
                  children: (
                    <ItemInfo
                      appContext={appContext}
                      data={data}
                      load={load}
                      closeModal={() => setOpen(false)}
                      permission={permission}
                    />
                  ),
                },
                {
                  label: "Actividad",
                  value: "activity",
                  children: (
                    <ItemActivity appContext={appContext} data={data} />
                  ),
                },
                {
                  label: "Conexiones",
                  value: "connections",
                  children: <ConnectionsEntity 
                  entity={Entity.ITEM}/>,
                },
              ]}
            />
          )}
        </>
      )}
    </ModalLayout>
    // <DetailLayout
    //   activities={activities}
    //   partyID={item?.id}
    //   navItems={navItems}
    // >
    //   {tab == "info" && <CustomerInfo />}
    //   {tab == "connections" && <CustomerConnections />}
    // </DetailLayout>
  );
}
