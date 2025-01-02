import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { createJournalEntrySchema } from "~/util/data/schemas/accounting/journal-entry-schema";
import NewQuotationClient from "./new-quotation.client";
import { lineItemSchemaToLineData } from "~/util/data/schemas/buying/order-schema";
import { format, formatRFC3339 } from "date-fns";
import { components } from "~/sdk";
import { createQuotationSchema, mapToQuotationData, quotationDataSchema } from "~/util/data/schemas/quotation/quotation-schema";
import { mapToTaxAndChargeData } from "~/util/data/schemas/accounting/tax-and-charge-schema";

type ActionData = {
  action: string;
  quotationData: z.infer<typeof quotationDataSchema>;
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
      const res = await client.POST("/quotation", {
        body:mapToQuotationData(data.quotationData,params.quotationParty || ""),
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
