import { formatRFC3339 } from "date-fns";
import { z } from "zod";
import { components } from "~/sdk";
import { formatAmount } from "~/util/format/formatCurrency";

export type JournalEntrySchema = z.infer<typeof journalEntrySchema>

export const journalEntryLineSchema = z.object({
  debit: z.coerce.number(),
  credit: z.coerce.number(),
  currency: z.string(),
  accountName: z.string(),
  accountID: z.number(),
  projectName: z.string().optional(),
  projectID: z.number().optional(),
  costCenterName: z.string().optional(),
  costCenterID: z.number().optional(),
});

export const journalEntrySchema = z.object({
  id:z.number().optional(),
  entryType: z.string(),
  postingDate: z.date(),
  lines: z.array(journalEntryLineSchema),
});

export const mapToJournalEntryData = (e:JournalEntrySchema)=>{
  const d:components["schemas"]["JournalEntryData"] = {
    id:e.id,
    fields:{
      entry_type:e.entryType,
      posting_date:formatRFC3339(e.postingDate),
    },
    entry_lines:e.lines.map(t=>mapToJournalEntryLineData(t))
  }
  return d
}

export const mapToJournalEntryLineData = (
  e: z.infer<typeof journalEntryLineSchema>
): components["schemas"]["JournalEntryLineData"] => {
  return {
    cost_center_id: e.costCenterID || null,
    credit: e.credit,
    debit: e.debit,
    ledger_id: e.accountID,
    project_id: e.projectID || null,
  };
};

export const mapToJournalEntryLineSchama = (
  e: components["schemas"]["JournalEntryLineDto"]
): z.infer<typeof journalEntryLineSchema> => {
  return {
    debit: formatAmount(e.debit),
    credit: formatAmount(e.credit),
    currency: e.currency,
    accountName: e.account,
    accountID: e.account_id,
    projectName: e.project || undefined,
    projectID: e.project_id || undefined,
    costCenterName: e.cost_center || undefined,
    costCenterID: e.cost_center_id || undefined,
  };
};
