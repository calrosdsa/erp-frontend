import { ActionFunctionArgs, json } from "@remix-run/node";
import CreatePurchaseOrdersClient from "./new-order.client";
import { z } from "zod";
import {
  createOrderSchema,
  lineItemSchemaToLineData,
} from "~/util/data/schemas/buying/purchase-schema";
import apiClient from "~/apiclient";
import { currencySchemaToCurrencyDto } from "~/util/data/schemas/app/currency-schema";
import { components } from "~/sdk";
import { format, formatRFC3339 } from "date-fns";
import { mapToTaxAndChargeData } from "~/util/data/schemas/accounting/tax-and-charge-schema";

type ActionData = {
  action: string;
  createPurchaseOrder: z.infer<typeof createOrderSchema>;
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
      const d = data.createPurchaseOrder;
      const lines = d.lines.map((t) => lineItemSchemaToLineData(t));
      const taxLines = d.taxLines.map((t) => mapToTaxAndChargeData(t));
      const res = await client.POST("/order", {
        body: {
          order: {
            order_party_type: params.partyOrder || "",
            delivery_date: d.deliveryDate && formatRFC3339(d.deliveryDate),
            posting_date: formatRFC3339(d.postingDate),
            posting_time: d.postingTime,
            tz: d.tz,
            party_id: d.partyID,
            currency: d.currency,
            project: d.projectID,
            cost_center: d.costCenterID,
            total_amount:
              d.lines.reduce(
                (prev, curr) => prev + Number(curr.quantity) * curr.rate,
                0
              ) +
              d.taxLines.reduce((prev, curr) => prev + Number(curr.amount), 0),
          },
          items: {
            lines: lines,
          },
          tax_and_charges: {
            lines: taxLines,
          },
        },
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
