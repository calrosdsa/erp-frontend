import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import TaskKanban from "./task-kanban.client";
import apiClient from "~/apiclient";
import { LOAD_ACTION, MAX_SIZE } from "~/constant";
import { Entity } from "~/types/enums";
import {
  Outlet,
  ShouldRevalidateFunctionArgs,
  useOutletContext,
} from "@remix-run/react";
import { GlobalState } from "~/types/app-types";
import { components } from "~/sdk";
import { getSession } from "~/sessions";

type ActionData = {
  taskTransition: components["schemas"]["EntityTransitionData"];
  action: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  const action = LOAD_ACTION;
  let shouldRevalidate: boolean = false;
  
  switch (data.action) {
    case "task-transition": {
      const res = await client.PUT("/task/transition", {
        body: data.taskTransition,
      });
      console.log(res.data?.errors, res.data?.message);
      message = res.data?.message;
      error = res.error?.detail;
      shouldRevalidate = true;
      break;
    }
  }
  
  return json({
    message,
    error,
    action,
    shouldRevalidate,
  });
};

export function shouldRevalidate({
  defaultShouldRevalidate,
  actionResult,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.shouldRevalidate) {
    return defaultShouldRevalidate;
  }
  return false;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const client = apiClient({ request });
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const session = await getSession(request.headers.get("Cookie"));
    console.log("LOAD TASKS...", session.data.access_token);
    
    // Parallelize requests with proper error handling
    const [tasksRes, stagesRes] = await Promise.all([
      client.GET("/task", {
        params: {
          query: {
            size: MAX_SIZE,
            column: "index",
            orientation: "ASC",
          },
        },
      }),
      client.GET("/stage", {
        params: {
          query: {
            size: MAX_SIZE,
            entity_id: searchParams.get("entity_id") ?? Entity.TASK.toString(),
            column: "index",
            orientation: "ASC",
          },
        },
      }),
    ]);

    return {
      tasks: tasksRes.data?.result,
      stages: stagesRes.data?.result,
      taskAction: tasksRes.data?.actions,
      actions: tasksRes.data?.actions,
    };
  } catch (error) {
    console.error("Loader error:", error);

    // Convert to proper error response
    throw new Response("Failed to load task data", {
      status: error instanceof Error ? 500 : 500,
    });
  }
};

export default function TaskRoute() {
  const globalContext = useOutletContext<GlobalState>();
  return (
    <>
      <Outlet context={globalContext} />
      <TaskKanban />
    </>
  );
}