import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import JournalEntryDetailClient from "./journal-entry-detail.client";
import { handleError } from "~/util/api/handle-status-code";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";

type ActionData = {
    action: string;
    updateStatusWithEvent:z.infer<typeof updateStatusWithEventSchema>;
  };
  
  export const action = async ({ request }: ActionFunctionArgs) => {
    const client = apiClient({ request });
    const data = (await request.json()) as ActionData;
    let message: string | undefined = undefined;
    let error: string | undefined = undefined;
    switch (data.action) {
      case "update-status-with-event": {
        const res = await client.PUT("/journal/update-status", {
          body: data.updateStatusWithEvent,
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
  

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const res = await client.GET("/journal/detail/{id}", {
    params: {
      path: {
        id: params.name || "",
      },
    },
  });
  handleError(res.error);
  return json({
    journalEntry: res.data?.result.entity.journal_entry,
    lines: res.data?.result.entity.journal_entry_lines || [],
    activities:res.data?.result.activities,
  });
};

export default function JournalEntryDetail() {
  return <JournalEntryDetailClient />;
}
