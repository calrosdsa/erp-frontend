import { z } from "zod";
import PriceListsClient from "./price-list.client";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { createPriceListSchema } from "~/util/data/schemas/stock/price-list-schema";
import { components, operations } from "~/sdk";
import { handleError } from "~/util/api/handle-status-code";

type PriceListAction = {
  action: string;
  query: operations["get-price-lists"]["parameters"]["query"];
  page?: string;
  size?: string;
  createPriceList: z.infer<typeof createPriceListSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = (await request.json()) as PriceListAction;
  let client = apiClient({ request });
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let priceLists: components["schemas"]["PriceListDto"][] = [];
  switch (data.action) {
    case "add-price-list": {
      const res = await client.POST("/stock/item/price-list", {
        body: data.createPriceList,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "get": {
      const res = await client.GET("/stock/item/price-list", {
        params: {
          query: data.query,
        },
      });
      if (res.data != undefined) {
        priceLists = res.data.pagination_result.results;
      }
      console.log(res.error);
      break;
    }
  }
  return json({
    priceLists,
    message,
    error,
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/stock/item/price-list", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
      },
    },
  });
  handleError(res.error);
  return json({
    paginationResult: res.data?.pagination_result,
    actions: res.data?.actions,
  });
};

export default function PriceLists() {
  return <PriceListsClient />;
}
