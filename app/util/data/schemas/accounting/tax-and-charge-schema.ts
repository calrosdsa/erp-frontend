import { z } from "zod";
import { TaxChargeLineType, taxChargeLineTypeToJSON } from "~/gen/common";
import { components } from "~/sdk";
import { formatAmount, formatAmountToInt } from "~/util/format/formatCurrency";
type TaxAndCharge = z.infer<typeof taxAndChargeSchema>;
export const taxAndChargeSchema = z.object({
  taxLineID: z.number().optional(),
  type: z.string(),
  accountHeadName: z.string(),
  accountHead: z.number(),
  amount: z.coerce.number().optional(),
  isDeducted: z.boolean(),
  taxRate: z.coerce.number().optional(),
});

export const mapToTaxAndChargeData = (
  line: TaxAndCharge
): components["schemas"]["TaxAndChargeLineData"] => {
  return {
    type: line.type,
    tax_rate: line.taxRate || 0,
    ledger: line.accountHead,
    amount: Number(line.amount),
    is_deducted: line.isDeducted,
  };
};
export const mapToTaxAndChargeLineDto = (
  line: TaxAndCharge
): components["schemas"]["TaxAndChargeLineDto"] => {
  const taxLineDto: components["schemas"]["TaxAndChargeLineDto"] = {
    account_head: line.accountHeadName,
    account_head_id: line.accountHead,
    account_head_uuid: "",
    amount: formatAmountToInt(line.amount) || 0,
    id: line.taxLineID || 0,
    is_deducted: line.isDeducted,
    tax_rate: line.taxRate || 0,
    type: line.type,
  };
  return taxLineDto;
};

export const toTaxAndChargeLineSchema = (
  line: components["schemas"]["TaxAndChargeLineDto"],
  opts?: {
    ignoreID?: boolean;
  }
): z.infer<typeof taxAndChargeSchema> => {
  const d: z.infer<typeof taxAndChargeSchema> = {
    type: line.type,
    taxRate: line.tax_rate,
    accountHeadName: line.account_head,
    accountHead: line.account_head_id,
    amount: formatAmount(Number(line.amount)),
    isDeducted: line.is_deducted,
  };
  if (!opts?.ignoreID) {
    d.taxLineID = line.id;
  }
  return d;
};
