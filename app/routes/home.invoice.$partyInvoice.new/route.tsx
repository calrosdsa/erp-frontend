import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import CreatePurchaseInvoiceClient from "./new-invoice.client";
import { z } from "zod";
import { invoiceDataSchema, mapToInvoiceBody } from "~/util/data/schemas/invoice/invoice-schema";
import { lineItemSchemaToLineData } from "~/util/data/schemas/buying/order-schema";
import { currencySchemaToCurrencyDto } from "~/util/data/schemas/app/currency-schema";
import { components } from "~/sdk";
import { PartyType } from "~/gen/common";
import { format, formatRFC3339 } from "date-fns";
import { mapToTaxAndChargeData } from "~/util/data/schemas/accounting/tax-and-charge-schema";

type ActionData = {
  action: string;
  invoiceData: z.infer<typeof invoiceDataSchema>;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  let invoice: components["schemas"]["InvoiceDto"] | undefined = undefined;
  switch (data.action) {
    case "create-invoice": {
      const res = await client.POST("/invoice", {
        body: mapToInvoiceBody(data.invoiceData)
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
