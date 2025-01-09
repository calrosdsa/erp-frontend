import { z } from "zod";
import { components } from "~/sdk";
import { formatAmount, formatAmountToInt } from "~/util/format/formatCurrency";
import {
  mapToTaxAndChargeData,
  taxAndChargeSchema,
} from "./tax-and-charge-schema";
import { field, fieldNull } from "..";
import { formatRFC3339 } from "date-fns";

export const paymentReferceSchema = z.object({
  partyID: z.number(),
  partyType: z.string(),
  partyName: z.string(),
  grandTotal: z.coerce.number(),
  outstanding: z.coerce.number(),
  allocated: z.coerce.number(),
  currency:z.string(),
});

export const paymentDataSchema = z.object({
  id: z.number().optional(),
  postingDate: z.date(),
  amount: z.coerce.number(),
  paymentType: z.string(),
  partyType:z.string(),
  // paymentTypeT: z.string(),

  party: field,
  // partyBankAccount: z.string().optional(),
  // companyBankAccount: z.string().optional(),
  partyReference: z.number().optional(),
  paymentReferences: z.array(paymentReferceSchema),
  taxLines: z.array(taxAndChargeSchema),
  //UUID
  accountPaidFrom: field,
  accountPaidTo: field,

  project: fieldNull,
  costCenter: fieldNull,
});

export const partyReferencesToDto = (
  d: z.infer<typeof paymentReferceSchema>
): components["schemas"]["CreatePaymentReference"] => {
  return {
    party_code: d.partyName,
    party_id: d.partyID,
    party_type: d.partyType,
    allocated: d.allocated,
    total: d.grandTotal,
    currency:d.currency,
    outstanding: d.outstanding,
  };
};

export const mapToPaymentReferenceSchema = (
  d: components["schemas"]["PaymentReferenceDto"]
): z.infer<typeof paymentReferceSchema> => {
  return {
    partyID: d.party_id,
    partyType: d.party_type,
    partyName: d.party_code,
    grandTotal: formatAmount(d.total),
    outstanding: formatAmount(d.outstanding),
    allocated: formatAmount(d.allocated),
    currency:d.currency,
  };
};

export const mapToPaymentBody = (
  e: z.infer<typeof paymentDataSchema>
): components["schemas"]["PaymentBody"] => {
  const d: components["schemas"]["PaymentData"] = {
    id: e.id,
    fields: {
      amount:formatAmountToInt(e.amount),
      cost_center_id: e.costCenter?.id,
      account_paid_from_id: e.accountPaidFrom.id || 0,
      account_paid_to_id: e.accountPaidTo.id || 0,
      party_id: e.party.id || 0,
      payment_type: e.paymentType,
      posting_date: formatRFC3339(e.postingDate),
      project_id: e.project?.id,
    },
  };
  return {
    payment: d,
    tax_and_charges: {
      lines: e.taxLines.map((t) => mapToTaxAndChargeData(t)),
    },
    payment_references: e.paymentReferences.map((t) => partyReferencesToDto(t)),
  };
};
