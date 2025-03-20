import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import { components, operations } from "~/sdk";

type ActionData = {
  action: string;
  notificationQuery: operations["notification"]["parameters"]["query"];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = (await request.json()) as ActionData;
  const client = apiClient({ request });
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let notifications: components["schemas"]["NotificationDto"][] = [];
  switch (data.action) {
    case "messages":{
        // const res= await client.GET()
        break
    }
    case "notification": {
      const res = await client.GET("/notification", {
        params: {
          query: data.notificationQuery,
        },
      });
      notifications = res.data?.result || [];
      break;
    }
  }
  return json({
    message,
    error,
    notifications,
  });
};
