import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import CreatePurchaseInvoiceClient from "./new-invoice.client";
import { z } from "zod";
import { createInvoiceSchema } from "~/util/data/schemas/invoice/invoice-schema";
import { lineItemSchemaToLineData } from "~/util/data/schemas/buying/purchase-schema";
import { currencySchemaToCurrencyDto } from "~/util/data/schemas/app/currency-schema";
import { components } from "~/sdk";
import { PartyType } from "~/gen/common";
import { format, formatRFC3339 } from "date-fns";
import { mapToTaxAndChargeData } from "~/util/data/schemas/accounting/tax-and-charge-schema";

type ActionData = {
  action: string;
  createPurchaseInvoice: z.infer<typeof createInvoiceSchema>;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  let invoice: components["schemas"]["InvoiceDto"] | undefined = undefined;
  switch (data.action) {
    case "create-invoice": {
      const d = data.createPurchaseInvoice;
      const lines = d.lines.map((t) => lineItemSchemaToLineData(t));
      const taxLines = d.taxLines.map((t) => mapToTaxAndChargeData(t));
      console.log("TAX LINES", taxLines);
      const res = await client.POST("/invoice", {
        body: {
          invoice: {
            party_id: d.partyID,
            invoice_party_type: params.partyInvoice || "",
            due_date: d.due_date?.toString(),
            posting_date: formatRFC3339(d.postingDate),
            posting_time: d.postingTime,
            tz: d.tz,
            project: d.projectID,
            cost_center: d.costCenterID,
            currency: d.currency,
            reference: d.referenceID,
            total_amount:
              d.lines.reduce(
                (prev, curr) => prev + Number(curr.quantity) * curr.rate,
                0
              ) +
              d.taxLines.reduce((prev, curr) => prev + Number(curr.amount), 0),
          },
          items: {
            update_stock: d.updateStock,
            lines: lines,
          },
          tax_and_charges: {
            lines: taxLines,
          },
        },
      });
      error = res.error?.detail;
      message = res.data?.message;
      invoice = res.data?.result;
      break;
    }
  }
  return json({
    error,
    message,
    invoice,
  });
};

export default function CreatePurchaseInvoice() {
  return <CreatePurchaseInvoiceClient />;
}
