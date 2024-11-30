import { ActionFunctionArgs, defer, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import EventDetailClient from "./event.client";
import { components } from "~/sdk";
import { RegatePartyType, regatePartyTypeToJSON } from "~/gen/common";
import { FetchResponse } from "openapi-fetch";
import { z } from "zod";
import { editEventSchema } from "~/util/data/schemas/regate/event-schema";


type ActionData = {
  action:string
  editEvent:z.infer<typeof editEventSchema>
}

export const action  =  async({request}:ActionFunctionArgs)=>{
  const client = apiClient({request})
  const data =await request.json() as ActionData
  let message:string | undefined = undefined
  let error:string |undefined = undefined
  switch(data.action){
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
      message,error
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tab = searchParams.get("tab");
  let resConnections: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  const res = await client.GET("/regate/event/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  handleError(res.error);
  if (res.data) {
    switch (tab) {
      case "connections": {
        resConnections  = client.GET("/party/connections/{id}", {
          params: {
            path: {
              id: res.data.result.entity.event?.id.toString(),
            },
            query: {
              party: regatePartyTypeToJSON(RegatePartyType.eventBooking),
            },
          },
        });
        // console.log(resConnection.data,resConnection.error)
        break
      }
    }
  }
  return defer({
    event: res.data?.result.entity.event,
    bookingInfo:res.data?.result.entity.booking_info,
    actions: res.data?.actions,
    activities: res.data?.result.activities,
    connections: resConnections,
  });
};

export default function EventDetail() {
  return <EventDetailClient />;
}
