import { defer, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import EventDetailClient from "./event.client";
import { components } from "~/sdk";
import { RegatePartyType, regatePartyTypeToJSON } from "~/gen/common";
import { FetchResponse } from "openapi-fetch";

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
  if (res.data) {
    switch (tab) {
      case "connections": {
        resConnections  = client.GET("/party/connections/{id}", {
          params: {
            path: {
              id: res.data.result.entity.id.toString(),
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
  handleError(res.error);
  return defer({
    event: res.data?.result.entity,
    actions: res.data?.actions,
    activities: res.data?.result.activities,
    connections: resConnections,
  });
};

export default function EventDetail() {
  return <EventDetailClient />;
}
