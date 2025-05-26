import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import JournalEntryDetailClient from "./journal-entry-modal";
import { handleError } from "~/util/api/handle-status-code";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import {
  JournalEntrySchema,
  mapToJournalEntryData,
} from "~/util/data/schemas/accounting/journal-entry-schema";
import { components } from "~/sdk";
import { DEFAULT_ID } from "~/constant";

type ActionData = {
  action: string;
  journalEntryData: JournalEntrySchema;
  updateStatus: z.infer<typeof updateStatusWithEventSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let journalEntry: components["schemas"]["JournalEntryDto"] | undefined =
    undefined;
  switch (data.action) {
    case "create-journalEntry": {
      const res = await client.POST("/journal", {
        body: mapToJournalEntryData(data.journalEntryData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      journalEntry = res.data?.result;
      break;
    }
    case "edit-journalEntry": {
      console.log("JOURNAL ENTRY DATA", data);
      const res = await client.PUT("/journal", {
        body: mapToJournalEntryData(data.journalEntryData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
    case "update-status": {
      const res = await client.PUT("/journal/update-status", {
        body: data.updateStatus,
      });
      console.log("UPDATE JOURNAL RES,", res.data, res.error);
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
  }
  return {
    message,
    error,
    journalEntry,
  };
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  let journalEntryResult:
    | components["schemas"]["EntityResponseResultEntityJournalEntryDetailDtoBody"]
    | undefined = undefined;
  if (params.id != DEFAULT_ID) {
    const res = await client.GET("/journal/detail/{id}", {
      params: {
        path: {
          id: params.code || "",
        },
      },
    });
    journalEntryResult = res.data;
    handleError(res.error);
  }
  return json({
    journalEntry: journalEntryResult?.result.entity.journal_entry,
    actions: journalEntryResult?.actions,
    activities: journalEntryResult?.result.activities,
    lines: journalEntryResult?.result.entity.journal_entry_lines,
  });
};
// export const loader = async ({ request, params }: LoaderFunctionArgs) => {

//   const client = apiClient({ request });
//   const res = await client.GET("/journal/detail/{id}", {
//     params: {
//       path: {
//         id: params.name || "",
//       },
//     },
//   });
//   handleError(res.error);
//   return json({
//     journalEntry: res.data?.result.entity.journal_entry,
//     lines: res.data?.result.entity.journal_entry_lines || [],
//     activities:res.data?.result.activities,
//   });
// };
