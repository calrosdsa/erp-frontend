import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import ItemPriceDetailClient from "./item-price.client";
import { handleError } from "~/util/api/handle-status-code";
import { z } from "zod";
import { editItemPriceSchema } from "~/util/data/schemas/stock/item-price-schema";
import { LOAD_ACTION } from "~/constant";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

type ActionData = {
  action: string;
  editData: z.infer<typeof editItemPriceSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION
  switch (data.action) {
    case "edit": {
      const d = data.editData;
      const res = await client.PUT("/stock/item/item-price", {
        body: {
          id: d.id,
          item_quantity: d.itemQuantity,
          item_id: d.itemID,
          price_list_id: d.priceListID,
          uom_id:d.uomID,
          rate: d.rate,
        },
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
  }
  return json({
    error,
    message,
    action:actionRes,
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
  const res = await client.GET("/stock/item/item-price/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  handleError(res.error);
  console.log(res.data, res.error);
  return json({
    itemPrice: res.data?.result.entity,
    actions: res.data?.actions,
    activities: res.data?.result.activities || [],
    associatedActions: res.data?.associated_actions,
  });
};

export default function ItemPriceDetail() {
  return (
    <div>
      {/* asdmask */}
      <ItemPriceDetailClient />
    </div>
  );
}
