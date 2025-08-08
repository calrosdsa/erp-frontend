import { useFetcher, useSearchParams } from "@remix-run/react";
import { action, loader } from "../route";
import { GlobalState } from "~/types/app-types";
import { useTaskStore } from "../task-store";
import {
  TaskData,
  taskSchema,
} from "~/util/data/schemas/task-schema";
import { fullName } from "~/util/convertor/convertor";
import TaskForm from "../task-form";
import { useEffect, useRef, useCallback, useState } from "react";
import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { useEntityPermission, usePermission } from "~/util/hooks/useActions";
import { Entity } from "~/types/enums";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { route } from "~/util/route";
import { SerializeFrom } from "@remix-run/node";
import { SmartForm } from "@/components/form/smart-form";
import { useModalStore } from "@/components/ui/custom/modal-layout";
import { LOADING_MESSAGE } from "~/constant";
import { toast } from "sonner";
import { Permission } from "~/types/permission";

export default function TaskInfoTab({
  appContext,
  data,
  keyPayload,
  load,
  permission,
}: {
  appContext: GlobalState;
  data?: SerializeFrom<typeof loader>;
  keyPayload: string;
  load: () => void;
  permission: Permission;
}) {
  const task = data?.task;
  const { profile, roleActions } = appContext;
  const [perm] = usePermission({
    actions: data?.actions,
    roleActions,
  });
  const { editPayload } = useModalStore();
  const fetcher = useFetcher<typeof action>();
  const { editPayload: editTaskPayload, payload: payloadTask } = useTaskStore();
  const payload = useModalStore((state) => state.payload[keyPayload]);
  const [searchParams, setSearchParams] = useSearchParams();
  const allowEdit = perm.edit;
  const [toastID, setToastID] = useState<string | number>("");

  const onSubmit = (data: TaskData) => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    const submitAction = data.id ? "edit" : "create";
    fetcher.submit(
      {
        action: submitAction,
        taskData: data as any,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.toRouteDetail(route.task, task?.id.toString() || "0"),
      }
    );

    editPayload(keyPayload, {
      enableEdit: false,
    });
  };

  useDisplayMessage(
    {
      toastID: toastID,
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.task) {
          console.log("NEW TASK", fetcher.data);
          searchParams.set("tab", "info");
          searchParams.set(route.task, fetcher.data.task.id.toString());
          setSearchParams(searchParams, {
            preventScrollReset: true,
          });
        }
        load();
      },
    },
    [fetcher.data]
  );

  return (
    <div className="grid grid-cols-9 gap-2">
      <div className="grid gap-3 col-span-4">
        <SmartForm
          permission={permission}
          isNew={payload?.isNew || false}
          title={"Task Information"}
          schema={taskSchema}
          keyPayload={keyPayload}
          defaultValues={{
            ...payloadTask,
            title: task?.title,
            description: task?.description,
            priority: task?.priority,
            stage: {
              id:task?.stage_id,
              name:task?.stage,
            },
            assignee: {
              id: task?.assignee_id,
              name: fullName(task?.assignee_family_name, task?.assignee_given_name),
            },
            project: {
              id: task?.project_id,
              name: task?.project,
            },
            due_date: task?.due_date ? new Date(task?.due_date) : undefined,
            index: task?.index || 0,
            id: task?.id,
          }}
          onSubmit={onSubmit}
        >
          <TaskForm
            keyPayload={keyPayload}
            allowEdit={allowEdit}
          />
        </SmartForm>
      </div>
      {task?.id != undefined && (
        <div className=" col-span-5">
          <ActivityFeed
            appContext={appContext}
            activities={data?.activities || []}
            partyID={task?.id}
            partyName={task.title}
            entityID={Entity.TASK}
          />
        </div>
      )}
    </div>
  );
}