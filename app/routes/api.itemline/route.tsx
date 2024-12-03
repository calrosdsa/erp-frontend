import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { LOAD_ACTION } from "~/constant";
import { lineItemSchema } from "~/util/data/schemas/stock/line-item-schema";

type ActionData = {
  action: string;
  editLineItem: z.infer<typeof lineItemSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "edit-line-item": {
      const d = data.editLineItem;
      console.log(d)
      const res = await client.PUT("/item-line", {
        body: {
          rate: d.rate,
          quantity: d.quantity || 0,
          item_line: d.itemLineID || 0,
          item_price_id: d.item_price_id,
          party_type: d.party_type || "",
        },
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log(res.data,res.error)
      break;
    }
  }
  return json({ message, error,
    action:LOAD_ACTION
   });
};
