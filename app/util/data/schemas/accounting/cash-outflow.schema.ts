import { z } from "zod";
import { field, fieldNull } from "..";
import { components } from "~/sdk";
import {
  mapToTaxAndChargeData,
  taxAndChargeSchema,
} from "./tax-and-charge-schema";
import { formatRFC3339 } from "date-fns";
import { formatAmountToInt } from "~/util/format/formatCurrency";

export type CashOutflowDataType = z.infer<typeof cashOutflowDataSchema>;

export const cashOutflowDataSchema = z.object({
  id: z.number().optional(),
  party: field,
  party_type: z.string(),
  concept: z.string().nullable().optional(),
  cash_outflow_type: z.string().nullable().optional(),
  invoice_no: z.string().nullable().optional(),
  nit: z.string().nullable().optional(),
  auth_code: z.string().nullable().optional(),
  ctrl_code: z.string().nullable().optional(),
  emision_date: z.date().nullable().optional(),

  posting_date: z.date(),
  posting_time: z.string(),
  tz: z.string(),

  amount: z.coerce.number(),

  project: fieldNull,
  cost_center: fieldNull,
  taxLines: z.array(taxAndChargeSchema),
});

export const mapToCashOutflowData = (e: CashOutflowDataType) => {
  const d: components["schemas"]["CashOutflowData"] = {
    fields: {
      amount: formatAmountToInt(e.amount),
      auth_code: e.auth_code,
      cash_outflow_type: e.cash_outflow_type,
      concept: e.concept,
      cost_center_id: e.cost_center?.id,
      ctrl_code: e.ctrl_code || null,
      emision_date: e.emision_date ? formatRFC3339(e.emision_date) : null,
      invoice_no: e.invoice_no,
      nit: e.nit,
      party_id: e.party.id || 0,
      party_type: e.party_type,
      posting_date: formatRFC3339(e.posting_date),
      posting_time: e.posting_time,
      project_id: e.project?.id,
      tz: e.tz,
    },
    id: e.id || 0,
    tax_and_charges: {
      lines: e.taxLines.map((t) => mapToTaxAndChargeData(t)),
    },
  };
  return d;
};
