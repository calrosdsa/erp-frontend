import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import { LOAD_ACTION } from "~/constant";
import { components, operations } from "~/sdk";
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
  let activity:components["schemas"]["ActivityDto"] | undefined = undefined;  
  let actionData = LOAD_ACTION;
  switch (data.action) {
    case "create": {
      // console.log("CREATE ACTIVITY",data.activityData)
      const res = await client.POST("/activity", {
        body: mapToActivityData(data.activityData),
      });
      // console.log("ACTIVITY DATA",res.data,res.error)
      error = res.error?.detail;
      message = res.data?.message;
      activity = res.data?.result;
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
    error,
    message,
    // action: actionData,
    activity,
  });
};
