import { z } from "zod";
import validateRequiredField, { field, fieldRequired } from "..";
import { components } from "~/sdk";

export type AccountSettingData = z.infer<typeof accountSettingSchema>;

export const accountSettingSchema = z
  .object({
    bank_account: fieldRequired,
    cash_account: fieldRequired,
    payable_account: fieldRequired,
    cost_of_good_sold_account: fieldRequired,
    receivable_account: fieldRequired,
    income_account: fieldRequired,
  })


export const mapToAccountSettingData = (e: AccountSettingData) => {
  const d: components["schemas"]["AccountSettingData"] = {
    fields: {
      bank_account: e.bank_account.id,
      cash_accunt: e.cash_account.id,
      cost_of_good_sold_account: e.cost_of_good_sold_account.id,
      income_account: e.income_account.id,
      payable_account: e.payable_account.id,
      receivable_account: e.receivable_account.id,
    },
    id: 0,
  };
  return d
};
