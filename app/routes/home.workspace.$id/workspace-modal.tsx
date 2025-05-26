import { SerializeFrom } from "@remix-run/node";
import { useEffect, useState } from "react";
import { route } from "~/util/route";
import { action, loader } from "./route";
import { useFetcher, useNavigate, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { EventState, State, stateFromJSON } from "~/gen/common";
import { z } from "zod";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import ModalLayout, {
  setUpModalPayload,
} from "@/components/ui/custom/modal-layout";
import { DEFAULT_ID } from "~/constant";
import { ButtonToolbar } from "~/types/actions";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import TabNavigation from "@/components/ui/custom/tab-navigation";
import { WorkSpaceInfo } from "./workspace-info";

export default function WorkspaceModal({
  appContext,
}: {
  appContext: GlobalState;
}) {
  const key = route.workspace;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SerializeFrom<typeof loader>>();
  const workspace = data?.result?.entity;
  const [open, setOpen] = useState(true);
  const fetcher = useFetcher<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { t, i18n } = useTranslation("common");
  const r = route;
  const workspaceID = searchParams.get(key);
  const navigate = useNavigate();
  const [permission] = usePermission({
    roleActions: appContext.roleActions,
    actions: data?.actions,
  });
  const allowEdit = permission.edit
  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(route.toRouteDetail(key, workspaceID));
      if (res.ok) {
        const body = (await res.json()) as SerializeFrom<typeof loader>;
        setData(body);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [workspaceID]);
  const onChangeState = (e: EventState) => {
    const body: z.infer<typeof updateStatusWithEventSchema> = {
      current_state: workspace?.status || "",
      party_id: workspaceID || "",
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
          main: key,
          routeSufix: [workspaceID || ""],
        }),
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

  setUpModalPayload(
    key,
    () => {
      const state = stateFromJSON(workspace?.status);
      const isNew = DEFAULT_ID == workspaceID;
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
        title: isNew ? "Nuevo Espacio de Trabajo" : workspace?.name,
        actions: isNew ? [] : actions,
        status: stateFromJSON(workspace?.status),
        isNew: isNew,
        enableEdit:isNew, 
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
    searchParams.delete(key);
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
        data && (
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
                  <WorkSpaceInfo
                    appContext={appContext}
                    data={data}
                    load={load}
                    closeModal={closeModal}
                    permission={permission}
                  />
                ),
              },
            ]}
          />
        )
      )}
    </ModalLayout>
  );
}
