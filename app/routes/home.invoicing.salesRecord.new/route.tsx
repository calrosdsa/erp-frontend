import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { createChargesTemplateSchema } from "~/util/data/schemas/accounting/charges-template-schema";
import { mapToTaxAndChargeData } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import NewCurrencyExchangeClient from "./new-sales-record";
import { createCurrencyExchangeSchema } from "~/util/data/schemas/core/currency-exchange-schema";
import { createSalesRecord, mapToSalesRecordData } from "~/util/data/schemas/invoicing/sales-record-schema";

type ActionData = {
  action: string;
  createSalesRecord: z.infer<typeof createSalesRecord>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = (await request.json()) as ActionData;
  const client = apiClient({ request });
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let salesRecord: components["schemas"]["SalesRecordDto"] | undefined =
    undefined;
  switch (data.action) {
    case "create-sales-record": {
      const d = data.createSalesRecord;
      const salesRecordData = mapToSalesRecordData(d)
      const res = await client.POST("/sales-record", {
        body: {
         ...salesRecordData
        },
      });
      console.log(res.data,res.error)
      message = res.data?.message;
      error = res.error?.detail;
      salesRecord = res.data?.result;
      break;
    }
  }
  
  return json({
    message,
    error,
    salesRecord,
  });
};

export default function NewSalesRecord() {
  return <NewCurrencyExchangeClient />;
}
