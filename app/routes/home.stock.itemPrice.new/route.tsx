import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import NewItemPriceClient from "./new-item-price.client";
import { z } from "zod";
import { createItemPriceSchema } from "~/util/data/schemas/stock/item-price-schema";
import { components } from "~/sdk";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "@remix-run/react";

type ActionData = {
  action: string;
  createItemPrice: z.infer<typeof createItemPriceSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  let itemPrice: components["schemas"]["ItemPriceDto"] | undefined = undefined;
  switch (data.action) {
    case "create-item-price": {
      const d = data.createItemPrice;
      const res = await client.POST("/stock/item/item-price", {
        body: {
          itemQuantity: d.itemQuantity,
          item_id: d.itemID,
          item_uuid: d.itemUuid,
          price_list_id: d.priceListID,
          price_list_uuid: d.priceListUuid,
          rate: d.rate,
          tax_id: d.taxID,
          tax_uuid: d.taxUuid,
        },
      });
      message = res.data?.message;
      error = res.error?.detail;
      itemPrice = res.data?.result;
      console.log(res.error);
    }
  }
  return json({
    message,
    error,
    itemPrice,
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const res = await client.GET("/stock/item/item-price/associated-actions");
  return json({
    associatedActions: res.data?.associated_actions,
  });
};

export default function NewItemPrice() {
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(-1);
  };
  return (
    
   <NewItemPriceClient/> 
  );
}
{
}
