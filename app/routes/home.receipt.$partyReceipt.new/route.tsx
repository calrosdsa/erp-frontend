import { z } from "zod";
import NewReceiptClient from "./new-receipt.client";
import { receiptDataSchema } from "~/util/data/schemas/receipt/receipt-schema";
import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { lineItemSchemaToLineData } from "~/util/data/schemas/buying/order-schema";
import { formatRFC3339 } from "date-fns";
import { mapToTaxAndChargeData } from "~/util/data/schemas/accounting/tax-and-charge-schema";

type ActionData = {
  action: string;
  createReceipt: z.infer<typeof receiptDataSchema>;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let receipt: components["schemas"]["ReceiptDto"] | undefined = undefined;
  switch (data.action) {
    case "create-receipt": {
      const d = data.createReceipt;
      const lines = d.lines.map((t) => lineItemSchemaToLineData(t));
      const taxLines = d.taxLines.map((t) => mapToTaxAndChargeData(t));
      const res = await client.POST("/receipt", {
        body: {
          receipt: {
            party_id: d.partyID,
            party_receipt: params.partyReceipt || "",
            posting_date: formatRFC3339(d.postingDate),
            posting_time: d.postingTime,
            tz: d.tz,
            project: d.projectID,
            cost_center: d.costCenterID,
            currency: d.currency,
            reference: d.referenceID,
          },
          items: {
            lines: lines,
          },
          tax_and_charges: {
            lines: taxLines,
          },
        },
      });
      console.log(res.error, res.data);
      message = res.data?.message;
      error = res.error?.detail;
      receipt = res.data?.result;
      break;
    }
  }
  return json({
    message,
    error,
    receipt,
  });
};

export default function NewReceipt() {
  return <NewReceiptClient />;
}
