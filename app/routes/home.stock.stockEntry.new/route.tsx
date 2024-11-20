import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { createJournalEntrySchema } from "~/util/data/schemas/accounting/journal-entry-schema";
import NewStockEntryClient from "./new-stock-entry.client";
import { createStockEntrySchema } from "~/util/data/schemas/stock/stock-entry-schema";
import { orderLineSchemaToOrderLineDto } from "~/util/data/schemas/buying/purchase-schema";
import { format, formatRFC3339 } from "date-fns";
import { components } from "~/sdk";

type ActionData = {
  action: string;
  createStockEntry: z.infer<typeof createStockEntrySchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let stockEntry: components["schemas"]["StockEntryDto"] | undefined =
    undefined;
  console.log("ACTION DATA", data);
  switch (data.action) {
    case "create-stock-entry": {
      const d = data.createStockEntry;
      console.log(format(d.postingDate, "yyyy-MM-dd"));
      const lines = d.lines.map((t) => orderLineSchemaToOrderLineDto(t));
      const res = await client.POST("/stock-entry", {
        body: {
          stock_entry: {
            entry_type: d.stockEntryType,
            posting_date: formatRFC3339(d.postingDate),
            currency: d.currency,
          },
          items: {
            lines: lines,
          },
        },
      });
      console.log(res.error);
      message = res.data?.message;
      error = res.error?.detail;
      stockEntry = res.data?.result
      break;
    }
  }
  return json({
    message,
    error,
    stockEntry,
  });
};
export default function NewStockEntry() {
  return <NewStockEntryClient />;
}
