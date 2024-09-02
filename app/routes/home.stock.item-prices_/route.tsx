import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import ItemPricesClient from "./item-prices.client";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { components } from "index";
import { itemPriceFormSchema } from "~/util/data/schemas/stock/item-price-schema";
import { z } from "zod";

type ActionData = {
  action: string;
  query: string;
  itemPriceFormSchema: z.infer<typeof itemPriceFormSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let itemPrices: components["schemas"]["ItemPrice"][] = [];
  switch (data.action) {
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
      const itemPriceFormData = data.itemPriceFormSchema;
      const res = await client.POST("/stock/item/item-price", {
        body: {
          itemPrice: {
            itemId: itemPriceFormData.itemId,
            itemQuantity: Number(itemPriceFormData.itemQuantity),
            priceListId: itemPriceFormData.priceListId,
            rate: Number(itemPriceFormData.rate),
            taxId: itemPriceFormData.taxId,
          },
          plugins: itemPriceFormData.plugins || [],
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
  console.log(res.data);
  return json({
    data: res.data,
  });
};

export default function ItemPrices() {
  return (
    <div>
      <ItemPricesClient />
    </div>
  );
}
