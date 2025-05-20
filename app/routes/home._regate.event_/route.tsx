import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE, LOAD_ACTION } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";
import EventsClient from "./events.client";
import { z } from "zod";
import { components } from "~/sdk";
import { State, stateToJSON } from "~/gen/common";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { route } from "~/util/route";
import {
  EventBookingSchema,
  mapToEventBookingData,
} from "~/util/data/schemas/regate/event-schema";
import { mapToBookingData } from "../home._regate.booking/util";

type ActionData = {
  action: string;
  eventData: EventBookingSchema;
  query: string;
  deleteInBatch: components["schemas"]["DeleteEventBatchRequestBody"];
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let events: components["schemas"]["EventBookingDto"][] = [];
  let event: components["schemas"]["EventBookingDto"] | undefined = undefined;
  let actions: components["schemas"]["ActionDto"][] = [];
  switch (data.action) {
    case "delete-in-batch": {
      const res = await client.DELETE("/regate/event/delete-in-batch", {
        body: data.deleteInBatch,
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
    case "get": {
      const res = await client.GET("/regate/event", {
        params: {
          query: {
            page: DEFAULT_PAGE,
            size: DEFAULT_SIZE,
            query: data.query,
            status: stateToJSON(State.ENABLED),
          },
        },
      });
      console.log("EVENTS", res.data);
      actions = res.data?.actions || [];
      events = res.data?.pagination_result.results || [];
      break;
    }
    case "create-event": {
      const res = await client.POST("/regate/event", {
        body: mapToEventBookingData(data.eventData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      event = res.data?.result;
      break;
    }
    case "edit-event": {
      const res = await client.PUT("/regate/event", {
        body: mapToEventBookingData(data.eventData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
  }
  return json({
    message,
    error,
    actions,
    events,
    event,
  });
};

export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult,
  nextUrl,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.actionRoot == LOAD_ACTION) {
    return defaultShouldRevalidate;
  }
  if (formMethod === "POST") {
    return false;
  }
  const nextParams = new URL(nextUrl.href).searchParams;
  const event = nextParams.get(route.event);
  if (event) {
    return false;
  }
  return defaultShouldRevalidate;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/regate/event", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
        query: searchParams.get("query") || "",
      },
    },
  });
  handleError(res.error);
  return json({
    paginationResult: res.data?.pagination_result,
    actions: res.data?.actions,
  });
};

export default function RegateEvents() {
  return <EventsClient />;
}
