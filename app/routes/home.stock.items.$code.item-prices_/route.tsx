import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import ItemDetailPricesClient from "./Item-detail-prices.client";
import { itemPriceFormSchema } from "~/util/data/schemas/stock/item-price-schema";
import { z } from "zod";

type ActionData = {
  action: string;
  itemPriceFormSchema: z.infer<typeof itemPriceFormSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  switch (data.action) {
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
      console.log(res.error);
      if (res.data) {
        message = res.data.message;
      }
      if (res.error) {
        error = res.error.detail;
      }
      break;
    }
  }
  return json({
    error,
    message,
  });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const itemPrices = await client.GET("/stock/item/item-price/{itemCode}", {
    params: {
      query: {
        size: DEFAULT_SIZE,
        page: DEFAULT_PAGE,
      },
      path: {
        itemCode: params.code || "",
      },
    },
  });
  return json({
    itemPrices: itemPrices.data,
  });
};

export default function ItemDetailPrices() {
  return <ItemDetailPricesClient />;
}
