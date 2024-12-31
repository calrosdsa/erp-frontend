import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";
import CostCenterClient from "./pricing.client";
import { z } from "zod";
import { State, stateToJSON } from "~/gen/common";
import { components, operations } from "~/sdk";
import CurrencyExchangeClient from "./pricing.client";
import PricingClient from "./pricing.client";

type ActionData = {
  action: string;
  query:operations["pricings"]["parameters"]["query"]
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let results: components["schemas"]["PricingDto"][] = [];
  let actions: components["schemas"]["ActionDto"][] = [];
  
  switch (data.action) {
    case "get": {
      const res = await client.GET("/pricing", {
        params: {
          query: data.query,
        },
      });
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/pricing", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
      },
    },
  });
  handleError(res.error);
  return json({
    data: res.data?.pagination_result,
    actions: res.data?.actions,
  });
};

export default function Pricing() {
  return <PricingClient />;
}
