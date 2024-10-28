import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import ItemPricesClient from "./item-prices.client";
import { DEFAULT_ENABLED, DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { createItemPriceSchema } from "~/util/data/schemas/stock/item-price-schema";
import { z } from "zod";
import { components } from "~/sdk";
import { handleError } from "~/util/api/handle-status-code";

type ActionData = {
  action: string;
  query: string;
  createItemPrice: z.infer<typeof createItemPriceSchema>;
  currency:string
  isSelling:boolean
  isBuying:boolean
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;

  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let itemPrices: components["schemas"]["ItemPriceDto"][] = [];
  let itemPriceForOrders:components["schemas"]["ItemPriceDto"][] = [];
  switch (data.action) {
    case "item-price-for-orders":{
      console.log(data)
      const res = await client.GET("/stock/item/item-price/order",{
        params:{
          query:{
            query:data.query || "",
            enabled:DEFAULT_ENABLED,
            currency:data.currency,
            isSelling:data.isSelling,
            isBuying:data.isBuying,
          }
        }
      })
      itemPriceForOrders = res.data?.result.entity || []
      break;
    }
    case "get": {
      const res = await client.GET("/stock/item/item-price", {
        params: {
          query: {
            page: DEFAULT_PAGE,
            size: DEFAULT_SIZE,
            query: data.query,
          },
        },
      });
      itemPrices = res.data?.pagination_result.results || [];
      break;
    }
    case "add-item-price": {
      const d = data.createItemPrice;
      console.log("DATA",d)
      const res = await client.POST("/stock/item/item-price", {
        body: {
            itemQuantity: d.itemQuantity,
            rate: d.rate,
            item_uuid:d.itemUuid,
            item_id:d.itemID,
            tax_uuid:d.taxUuid,
            tax_id:d.taxID,
            price_list_uuid:d.priceListUuid,
            price_list_id:d.priceListID,

        },
      });
      message = res.data?.message
      error = res.error?.detail
      break;
    }
  }
  return json({
    message,
    error,
    itemPrices,
    itemPriceForOrders,
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const params = url.searchParams;
  const res = await client.GET("/stock/item/item-price", {
    params: {
      query: {
        page: params.get("page") || DEFAULT_PAGE,
        size: params.get("size") || DEFAULT_SIZE,
      },
    },
  });
  handleError(res.error)
  // console.log(res.data,res.error)
  return json({
    paginationResult: res.data?.pagination_result,
    actions:res.data?.actions
  });
};

export default function ItemPrices() {
  return (
    <div>
      <ItemPricesClient />
    </div>
  );
}
