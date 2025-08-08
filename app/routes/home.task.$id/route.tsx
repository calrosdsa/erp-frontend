import { TaskData, mapToTaskData } from "~/util/data/schemas/task-schema";
import TaskModal from "./task-modal";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import { DEFAULT_ID, LOAD_ACTION, MAX_SIZE } from "~/constant";
import { Entity } from "~/types/enums";
import { components } from "~/sdk";
import { ShouldRevalidateFunctionArgs, useOutletContext } from "@remix-run/react";
import { route } from "~/util/route";
import { GlobalState } from "~/types/app-types";

type ActionData = {
  action: string;
  taskData: TaskData;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let task: components["schemas"]["TaskDto"] | undefined = undefined;
  let action = LOAD_ACTION;
  let shouldRevalidate: boolean = false;
  
  switch (data.action) {
    case "edit": {
      const res = await client.PUT("/task", {
        body: mapToTaskData(data.taskData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      shouldRevalidate = true;
      break;
    }
    case "create": {
      const res = await client.POST("/task", {
        body: mapToTaskData(data.taskData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      
      console.log(res.error)

      task = res.data?.result;
      shouldRevalidate = true;
      break;
    }
  }
  
  return json({
    action,
    error,
    message,
    task,
    shouldRevalidate,
  });
};

export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.shouldRevalidate) {
    return defaultShouldRevalidate;
  }
  return false;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const entityId = searchParams.get("entity_id") ?? Entity.TASK.toString();
  let stages: components["schemas"]["StageDto"][] = [];
  let taskData:
    | components["schemas"]["EntityResponseResultEntityTaskDetailDtoBody"]
    | undefined = undefined;

  if (params.id != DEFAULT_ID) {
    const [stagesRes, taskRes] = await Promise.all([
      client.GET("/stage", {
        params: {
          query: {
            size: MAX_SIZE,
            entity_id: entityId,
            column: "index",
            orientation: "ASC",
          },
        },
      }),
      client.GET("/task/detail/{id}", {
        params: {
          path: {
            id: params.id || "",
          },
        },
      }),
    ]);
    
    stages = stagesRes.data?.result || [];
    taskData = taskRes?.data;
  }

  return json({
    stages: stages || [],
    task: taskData?.result.entity.task || null,
    observers: [], // TODO: Add participants/observers support when available in API
    activities: taskData?.result.activities || [],
    actions: taskData?.actions,
    contacts: taskData?.result.contacts || [],
    entityActions: taskData?.associated_actions,
  });
};

export const openTaskModal = (
  id?: string,
  callback?: (key: string, value: string) => void
) => {
  if (id && callback) {
    callback(route.task, id);
  }
};

export default function TaskRoute() {
  const globalContext = useOutletContext<GlobalState>();
  return <TaskModal appContext={globalContext} />;
}