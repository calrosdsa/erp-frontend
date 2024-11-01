import { z } from "zod";
import { components } from "~/sdk";

export const paymentReferceSchema = z.object({
  partyID:z.number(),
  partyType: z.string(),
  partyName: z.string(),
  grandTotal: z.number(),
  outstanding: z.number(),
  allocated: z.number(),
});

export const createPaymentSchema = z.object({
  postingDate: z.date(),
  amount: z.coerce.number(),
  paymentType: z.string(),

  partyType: z.string(),
  partyUuid: z.string(),
  partyName: z.string(),
  partyBankAccount: z.string().optional(),
  companyBankAccount: z.string().optional(),
  partyReference: z.number().optional(),

  //Party references
  partyReferences: z.array(paymentReferceSchema),

  //UUID
  accountPaidFrom: z.number().optional(),
  accountPaidTo: z.number().optional(),
  accountPaidFromName: z.string().optional(),
  accountPaidToName: z.string().optional(),
});

export const partyReferencesToDto = (
  d: z.infer<typeof paymentReferceSchema>
): components["schemas"]["CreatePaymentReference"] => {
  return {
    party_code:d.partyName,
    party_id:d.partyID,
    party_type:d.partyType,
    allocated:d.allocated,
    total:d.grandTotal,
    outstanding:d.outstanding,
  };
};
