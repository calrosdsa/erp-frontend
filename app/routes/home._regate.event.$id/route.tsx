import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import EventModal from "./event-modal";
import { components } from "~/sdk";
import { RegatePartyType, regatePartyTypeToJSON } from "~/gen/common";
import { FetchResponse } from "openapi-fetch";
import { z } from "zod";
import { editEventSchema } from "~/util/data/schemas/regate/event-schema";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { route } from "~/util/route";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";

type ActionData = {
  action: string;
  editEvent: z.infer<typeof editEventSchema>;
  updateStatusWithEvent: z.infer<typeof updateStatusWithEventSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "update-status-with-event": {
      console.log("UPDATE STATUS",data)
      const res = await client.PUT("/regate/event/update-status", {
        body: data.updateStatusWithEvent,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit-event": {
      const d = data.editEvent;
      const res = await client.PUT("/regate/event", {
        body: {
          event_id: d.eventID,
          name: d.name,
        },
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
  }
  return json({
    message,
    error,
  });
};

export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult
}:ShouldRevalidateFunctionArgs) {
  if (actionResult?.action == LOAD_ACTION) {
    return defaultShouldRevalidate;
  }
  if (formMethod === "POST") {
    return false;
  }
  return defaultShouldRevalidate;
}

export const loader = async ({ request,params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tab = searchParams.get("tab");
  let connections:components["schemas"]["PartyConnections"][] = []
  const res = await client.GET("/regate/event/detail/{id}", {
    params: {
      path: {
        id: params.id || "",
      },
    },
  });
  handleError(res.error);
  if (res.data) {
    switch (tab) {
      case "connections": {
        const resConnections =await client.GET("/party/connections/{id}", {
          params: {
            path: {
              id: res.data.result.entity.event?.id.toString(),
            },
            query: {
              party: regatePartyTypeToJSON(RegatePartyType.eventBooking),
            },
          },
        });
        connections = resConnections.data?.result || []
        // console.log(resConnection.data,resConnection.error)
        break;
      }
    }
  }
  return {
    event: res.data?.result.entity.event,
    bookingInfo: res.data?.result.entity.booking_info,
    actions: res.data?.actions,
    activities: res.data?.result.activities,
    connections: connections,
  };
};

export const openEventModal = (
  id?: string,
  callback?: (key: string, value: string) => void
) => {
  if (id && callback) {
    callback(route.event, id);
  }
};
