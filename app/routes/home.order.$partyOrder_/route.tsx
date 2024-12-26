import { json, LoaderFunctionArgs } from "@remix-run/node";
import OrdersClient from "./orders.client";
import { Laptop } from "lucide-react";
import apiClient from "~/apiclient";
import { PartyType } from "~/types/enums";
import {
  DEFAULT_COLUMN,
  DEFAULT_ORDER,
  DEFAULT_PAGE,
  DEFAULT_SIZE,
} from "~/constant";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/order/{party}", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
        query: searchParams.get("query") || "",
        order: searchParams.get("order") || DEFAULT_ORDER,
        column: searchParams.get("column") || DEFAULT_COLUMN,
        status: searchParams.get("status") || "",
        delivery_date: searchParams.get("delivery_date") || "",
        posting_date: searchParams.get("posting_date") || "",
        party_id: searchParams.get("party") || "",
      },
      path: {
        party: params.partyOrder || "",
      },
    },
  });
  console.log(res.data?.pagination_result.results);
  return json({
    paginationResult: res.data?.pagination_result,
    actions: res.data?.actions,
    filters: res.data?.pagination_result.filters,
  });
};

export default function Purchases() {
  return <OrdersClient />;
}
