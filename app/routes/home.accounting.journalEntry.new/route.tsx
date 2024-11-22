import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import {
  createJournalEntrySchema,
  mapToJournalEntryLineData,
} from "~/util/data/schemas/accounting/journal-entry-schema";
import NewJournalEntryClient from "./new-journal-entry.client";
import { formatRFC3339 } from "date-fns";

type ActionData = {
  action: string;
  createJournalEntry: z.infer<typeof createJournalEntrySchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "create-journal-entry": {
      const d = data.createJournalEntry;
      const entryLines = d.lines.map((t) => mapToJournalEntryLineData(t));
      console.log(d);
      const res = await client.POST("/journal", {
        body: {
          entry_type: d.entryType,
          posting_date: formatRFC3339(d.postingDate),
          entry_lines: entryLines,
        },
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
  }
  return json({
    message,
    error,
  });
};

export default function NewJournalEntry() {
  return <NewJournalEntryClient />;
}
