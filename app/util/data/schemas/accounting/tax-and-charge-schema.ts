import { z } from "zod";
import { TaxChargeLineType, taxChargeLineTypeToJSON } from "~/gen/common";
import { components } from "~/sdk";

export const taxAndChargeSchema = z.object({
  taxLineID: z.number().optional(),
  type: z.enum([
    taxChargeLineTypeToJSON(TaxChargeLineType.FIXED_AMOUNT),
    taxChargeLineTypeToJSON(TaxChargeLineType.ON_NET_TOTAL),
  ]),
  accountHeadName: z.string(),
  accountHead: z.number(),
  taxRate: z.coerce.number(),
});


export const mapToTaxAndChargeData = (line:z.infer<typeof taxAndChargeSchema>):components["schemas"]["TaxAndChargeLineData"] =>{
    return {
        type:line.type,
        tax_rate:line.taxRate,
        ledger:line.accountHead,
    }
}