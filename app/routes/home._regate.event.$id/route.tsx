import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import { components } from "~/sdk";
import { RegatePartyType, regatePartyTypeToJSON } from "~/gen/common";
import { z } from "zod";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { route } from "~/util/route";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { DEFAULT_ID } from "~/constant";

type ActionData = {
  action: string;
  updateStatusWithEvent: z.infer<typeof updateStatusWithEventSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "update-status-with-event": {
      console.log("UPDATE STATUS", data);
      const res = await client.PUT("/regate/event/update-status", {
        body: data.updateStatusWithEvent,
      });
      message = res.data?.message;
      error = res.error?.detail;
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
  actionResult,
}: ShouldRevalidateFunctionArgs) {
 
  return false;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tab = searchParams.get("tab");
  let connections: components["schemas"]["PartyConnections"][] = [];
  let result:
    | components["schemas"]["EntityResponseResultEntityEventBookingDetailBody"]
    | undefined = undefined;
  if (params.id != DEFAULT_ID) {
    const res = await client.GET("/regate/event/detail/{id}", {
      params: {
        path: {
          id: params.id || "",
        },
      },
    });
    result = res.data;
    handleError(res.error);
    if (res.data) {
      switch (tab) {
        case "connections": {
          const resConnections = await client.GET("/party/connections/{id}", {
            params: {
              path: {
                id: res.data.result.entity.event?.id.toString(),
              },
              query: {
                party: regatePartyTypeToJSON(RegatePartyType.eventBooking),
              },
            },
          });
          connections = resConnections.data?.result || [];
          console.log("CONECTIONS");
          // console.log(resConnection.data,resConnection.error)
          break;
        }
      }
    }
  }
  return {
    event: result?.result.entity.event,
    bookingInfo: result?.result.entity.booking_info,
    actions: result?.actions,
    activities: result?.result.activities,
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
