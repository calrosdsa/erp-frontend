import { route } from "~/util/route";
import { loader } from "./route";
import { SerializeFrom } from "@remix-run/node";
import { useEffect, useState } from "react";
import { GlobalState } from "~/types/app-types";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { action } from "../home.task/route";
import { useTaskStore } from "./task-store";
import { useEntityPermission, usePermission } from "~/util/hooks/useActions";
import { components } from "~/sdk";
import { toast } from "sonner";
import { DEFAULT_ID, LOADING_MESSAGE } from "~/constant";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpModalPayload } from "@/components/ui/custom/modal-layout";
import { ButtonToolbar } from "~/types/actions";

export const TaskViewModel = ({ appContext }: { appContext: GlobalState }) => {
  const key = route.task;
  const [data, setData] = useState<SerializeFrom<typeof loader>>();
  const [loading, setLoading] = useState(false);
  const task = data?.task;
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { t } = useTranslation("common");
  const fetcherStage = useFetcher<typeof action>();
  const { payload, editPayload } = useTaskStore();
  const [open, setOpen] = useState(true);
  const stages = data?.stages;
  const id = searchParams.get(route.task) || "";
  const [toastID, setToastID] = useState<string | number>("");
  const entityPermission = useEntityPermission({
    entities: data?.entityActions,
    roleActions: appContext.roleActions,
  });
  const [permission] = usePermission({
    roleActions: appContext.roleActions,
    actions: data?.actions,
  });

  const taskTransition = (
    destinationStage: components["schemas"]["StageDto"]
  ) => {
    if (!task?.id) return;
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    const body: components["schemas"]["EntityTransitionData"] = {
      id: task?.id,
      destination_index: destinationStage.index,
      destination_stage_id: destinationStage.id,
      source_index: 0, // TODO: Add index to TaskDto if needed
      source_stage_id: 0, // TODO: Add stage_id to TaskDto if needed  
      source_name: task.stage,
      destination_name: destinationStage.name,
    };
    fetcherStage.submit(
      {
        action: "task-transition",
        taskTransition: body,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.toRoute({
          main: route.task,
        }),
      }
    );
  };

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(route.toRouteDetail(route.task, id));
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
    if (id) {
      load();
    }
  }, [id]);

  useDisplayMessage(
    {
      toastID: toastID,
      success: fetcherStage.data?.message,
      error: fetcherStage.data?.error,
      onSuccessMessage: () => {
        load();
      },
    },
    [fetcherStage.data]
  );

  useEffect(() => {
    if (!open) {
      searchParams.delete(route.task);
      setSearchParams(searchParams, {
        preventScrollReset: true,
      });
    }
  }, [open]);

  setUpModalPayload(
    key,
    () => {
      let actions: ButtonToolbar[] = [];
      const isNew = DEFAULT_ID == id;

      console.log("MOUNT TASK...", task);

      return {
        title: isNew ? "Nueva tarea" : task?.title,
        enableEdit: isNew,
        actions: actions,
        isNew: isNew,
        onCancel: isNew
          ? () => {
              setOpen(false);
            }
          : undefined,
      };
    },
    [data]
  );

  return {
    key,
    data,
    setOpen,
    stages,
    task,
    loading,
    load,
    open,
    taskTransition,
    payload,
    tab,
    searchParams,
    setSearchParams,
    permission,
  };
};