import { ActionFunctionArgs, json } from "@remix-run/node";
import CreatePurchaseOrdersClient from "./new-order.client";
import { z } from "zod";
import {
  orderDataSchema,
  lineItemSchemaToLineData,
  mapToOrderData,
} from "~/util/data/schemas/buying/order-schema";
import apiClient from "~/apiclient";
import { components } from "~/sdk";

type ActionData = {
  action: string;
  orderData: z.infer<typeof orderDataSchema>;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let order: components["schemas"]["OrderDto"] | undefined = undefined;
  switch (data.action) {
    case "create-order": {
      console.log(data);
      const res = await client.POST("/order", {
        body: mapToOrderData(data.orderData, params.partyOrder || ""),
      });
      message = res.data?.message;
      error = res.error?.detail;
      order = res.data?.result.entity;
      console.log(res.data, res.error);
      break;
    }
  }
  return json({
    message,
    error,
    order,
  });
};

export default function CreatePurchaseOrders() {
  return (
    <div>
      <CreatePurchaseOrdersClient />
    </div>
  );
}
