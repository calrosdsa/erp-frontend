import { z } from "zod";
import { components } from "~/sdk";
import { formatAmount } from "~/util/format/formatCurrency";
import { taxAndChargeSchema } from "./tax-and-charge-schema";

export const paymentReferceSchema = z.object({
  partyID:z.number(),
  partyType: z.string(),
  partyName: z.string(),
  grandTotal: z.coerce.number(),
  outstanding: z.coerce.number(),
  allocated: z.coerce.number(),
});

export const createPaymentSchema = z.object({
  postingDate: z.date(),
  amount: z.coerce.number(),
  paymentType: z.string(),

  party: z.string(),
  partyType: z.string(),
  partyID: z.number(),
  // partyBankAccount: z.string().optional(),
  // companyBankAccount: z.string().optional(),
  partyReference: z.number().optional(),

  //Party references
  partyReferences: z.array(paymentReferceSchema),
  taxLines: z.array(taxAndChargeSchema),

  //UUID
  accountPaidFromID: z.number().optional(),
  accountPaidToID: z.number().optional(),
  accountPaidFromName: z.string().optional(),
  accountPaidToName: z.string().optional(),
})
.superRefine((data,ctx)=>{
    if(data.partyReferences.length > 0)  {
      data.partyReferences = data.partyReferences.map((t)=>{
        t.allocated = formatAmount(t.allocated)
        t.outstanding = formatAmount(t.outstanding)
        t.grandTotal = formatAmount(t.grandTotal)   
        return t
      })
    }
});
export const editPayment = z.object({
  id:z.number(),
  postingDate: z.date(),
  amount: z.coerce.number(),
  paymentType: z.string(),
  paymentTypeT:z.string(),

  party: z.string(),
  partyType: z.string(),
  partyID: z.number(),
  // partyBankAccount: z.string().optional(),
  // companyBankAccount: z.string().optional(),
  partyReference: z.number().optional(),
  paymentReferences: z.array(paymentReferceSchema),
  //UUID
  accountPaidFromID: z.number().optional(),
  accountPaidFromName: z.string().optional(),
  accountPaidToID: z.number().optional(),
  accountPaidToName: z.string().optional(),
})

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

export const mapToPaymentReferenceSchema = (
  d: components["schemas"]["PaymentReferenceDto"]
): z.infer<typeof paymentReferceSchema> => {
  return {
    partyID: d.party_id,
    partyType: d.party_type,
    partyName: d.party_code,
    grandTotal: d.total,
    outstanding: d.outstanding,
    allocated: d.allocated,
  };
};
