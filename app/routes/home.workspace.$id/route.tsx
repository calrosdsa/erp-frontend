import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { DEFAULT_ID, LOAD_ACTION } from "~/constant";
import { components } from "~/sdk";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import {
  mapToWorkSpaceData,
  WorkSpaceData,
} from "~/util/data/schemas/core/workspace-schema";

type ActionData = {
  action: string;
  workspaceData: WorkSpaceData;
  updateStatus: z.infer<typeof updateStatusWithEventSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let actionRes = LOAD_ACTION;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let workspace: components["schemas"]["WorkSpaceDto"] | undefined = undefined;
  switch (data.action) {
    case "update-status": {
      const res = await client.PUT("/workspace/update-status", {
        body: data.updateStatus,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "create-workspace": {
      const res = await client.POST("/workspace", {
        body: mapToWorkSpaceData(data.workspaceData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      workspace = res.data?.result;
      break;
    }
    case "edit-workspace": {
      const res = await client.PUT("/workspace", {
        body: mapToWorkSpaceData(data.workspaceData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
  }
  return {
    error,
    message,
    action: actionRes,
    workspace,
  };
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  let result: components["schemas"]["ResultEntityWorkSpaceDto"] | undefined =
    undefined;
  let actions: components["schemas"]["ActionDto"][] = [];
  if (params.id != DEFAULT_ID) {
    const res = await client.GET("/workspace/detail/{id}", {
      params: {
        path: {
          id: params.id || "",
        },
      },
    });
    result = res.data?.result;
    actions = res.data?.actions || [];
  }

  return {
    result,
    actions,
  };
};
