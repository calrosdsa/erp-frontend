import { z } from "zod";
import NewReceiptClient from "./new-receipt.client";
import { mapToReceiptData, receiptDataSchema } from "~/util/data/schemas/receipt/receipt-schema";
import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { lineItemSchemaToLineData } from "~/util/data/schemas/buying/order-schema";
import { formatRFC3339 } from "date-fns";
import { mapToTaxAndChargeData } from "~/util/data/schemas/accounting/tax-and-charge-schema";

type ActionData = {
  action: string;
  receiptData: z.infer<typeof receiptDataSchema>;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let receipt: components["schemas"]["ReceiptDto"] | undefined = undefined;
  switch (data.action) {
    case "create-receipt": {
      const res = await client.POST("/receipt", {
        body: mapToReceiptData(data.receiptData),
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
