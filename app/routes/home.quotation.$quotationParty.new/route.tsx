import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { createJournalEntrySchema } from "~/util/data/schemas/accounting/journal-entry-schema";
import NewQuotationClient from "./new-quotation.client";
import { lineItemSchemaToLineData } from "~/util/data/schemas/buying/purchase-schema";
import { format, formatRFC3339 } from "date-fns";
import { components } from "~/sdk";
import { createQuotationSchema } from "~/util/data/schemas/quotation/quotation-schema";
import { mapToTaxAndChargeData } from "~/util/data/schemas/accounting/tax-and-charge-schema";

type ActionData = {
  action: string;
  createQuotation: z.infer<typeof createQuotationSchema>;
};
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let quotation: components["schemas"]["QuotationDto"] | undefined = undefined;
  console.log("ACTION DATA", data);
  switch (data.action) {
    case "create-quotation": {
      const d = data.createQuotation;
      // console.log(format(d.postingDate, "yyyy-MM-dd"));
      const lines = d.lines.map((t) => lineItemSchemaToLineData(t));
      const taxLines = d.taxLines.map((t) => mapToTaxAndChargeData(t));
      console.log(format(d.postingTime, "HH:mm"));
      const res = await client.POST("/quotation", {
        body: {
          quotation: {
            posting_date: formatRFC3339(d.postingDate),
            posting_time: format(d.postingTime, "HH:mm"),
            tz: d.tz,
            party_id: d.partyID,
            quotation_party_type: params.quotationParty || "",
            currency: d.currency,
            valid_till: formatRFC3339(d.validTill),
            project: d.projectID,
            cost_center: d.costCenterID,
          },
          items: {
            lines: lines,
          },
          tax_and_charges: {
            lines: taxLines,
          },
        },
      });
      console.log(res.error);
      message = res.data?.message;
      error = res.error?.detail;
      quotation = res.data?.result;
      break;
    }
  }
  return json({
    message,
    error,
    quotation,
  });
};
export default function NewQuotation() {
  return <NewQuotationClient />;
}
