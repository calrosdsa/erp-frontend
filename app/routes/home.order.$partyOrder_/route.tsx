import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import OrdersClient from "./orders.client";
import apiClient from "~/apiclient";
import {
  DEFAULT_COLUMN,
  DEFAULT_ORDER,
  DEFAULT_PAGE,
  DEFAULT_SIZE,
  LOAD_ACTION,
} from "~/constant";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { components, operations } from "~/sdk";

type ActionData = {
  action:string
  query:operations["orders"]["parameters"]["query"]
}

export const action = async ({ request,params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let results: components["schemas"]["OrderDto"][] = [];
  let actions: components["schemas"]["ActionDto"][] = [];
  
  console.log("QUERY DATA",data.query)
  switch (data.action) {
    case "get": {
      const res = await client.GET("/order/{party}", {
        params: {
          query: data.query,
          path: {
            party:params.partyOrder || ""
          },
        },
      });
      console.log("ORDERS",res.data?.pagination_result.results)
      results = res.data?.pagination_result.results || [];
      actions = res.data?.actions || [];
      break;
    }
  }
  return json({
    message,
    error,
    results,
    actions
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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/order/{party}", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
        code: searchParams.get("code") || "",
        orientation: searchParams.get("orientation") || DEFAULT_ORDER,
        column: searchParams.get("column") || DEFAULT_COLUMN,
        status: searchParams.get("status") || "",
        delivery_date: searchParams.get("delivery_date") || "",
        posting_date: searchParams.get("posting_date") || "",
        party_id: searchParams.get("party") || "",
        pricing_id: searchParams.get("pricing_id") || "",
      },
      path: {
        party: params.partyOrder || "",
      },
    },
  });
  // console.log(res.data?.pagination_result.results);
  return json({
    paginationResult: res.data?.pagination_result,
    actions: res.data?.actions,
    filters: res.data?.pagination_result.filters,
  });
};

export default function Purchases() {
  return <OrdersClient />;
}
