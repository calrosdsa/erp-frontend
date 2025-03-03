import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import { operations } from "~/sdk";
import {
  ActivityData,
  mapToActivityData,
} from "~/util/data/schemas/core/activity-schema";

type ActionData = {
  action: string;
  activityData: ActivityData;
  deleteQuery: operations["delete-activity"]["parameters"]["query"];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  switch (data.action) {
    case "create": {
      const res = await client.POST("/activity", {
        body: mapToActivityData(data.activityData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
    case "edit": {
      const res = await client.PUT("/activity", {
        body: mapToActivityData(data.activityData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
    case "delete": {
      const res = await client.DELETE("/activity", {
        params: {
          query: data.deleteQuery,
        },
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
  }
  return json({
    error,message
  });
};
