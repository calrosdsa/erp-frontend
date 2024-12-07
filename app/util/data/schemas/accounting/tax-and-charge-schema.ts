import { z } from "zod";
import { TaxChargeLineType, taxChargeLineTypeToJSON } from "~/gen/common";
import { components } from "~/sdk";
import { formatAmount } from "~/util/format/formatCurrency";

export const taxAndChargeSchema = z.object({
  taxLineID: z.number().optional(),
  type: z.enum([
    taxChargeLineTypeToJSON(TaxChargeLineType.FIXED_AMOUNT),
    taxChargeLineTypeToJSON(TaxChargeLineType.ON_NET_TOTAL),
  ]),
  accountHeadName: z.string(),
  accountHead: z.number(),
  amount: z.coerce.number().optional(),
  isDeducted: z.boolean(),
  taxRate: z.coerce.number().optional(),
});

export const mapToTaxAndChargeData = (
  line: z.infer<typeof taxAndChargeSchema>
): components["schemas"]["TaxAndChargeLineData"] => {
  return {
    type: line.type,
    tax_rate: line.taxRate || 0,
    ledger: line.accountHead,
    amount: Number(line.amount),
    is_deducted: line.isDeducted,
  };
};

export const toTaxAndChargeLineSchema = (
  line: components["schemas"]["TaxAndChargeLineDto"],
  opts?:{
    ignoreID?:boolean
  }
): z.infer<typeof taxAndChargeSchema> => {
  const d:z.infer<typeof taxAndChargeSchema> = {
    type: line.type,
    taxRate: line.tax_rate,
    accountHeadName: line.account_head,
    accountHead: line.account_head_id,
    amount: formatAmount(Number(line.amount)),
    isDeducted: line.is_deducted,
  }
  if(!opts?.ignoreID){
    d.taxLineID = line.id
  } 
  return d;
};
