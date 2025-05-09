import { z } from "zod";
import { components } from "~/sdk";
import validateRequiredField, { field, fieldNull } from "..";

export type BankAccountType = z.infer<typeof bankAccountSchema>;

export const bankAccountSchema = z
  .object({
    id: z.number().optional(),
    account_name: z.string(),
    bank_account_type: z.string(),
    bank: field,
    partyType: z.string().nullable().optional(),
    party: fieldNull,
    iban: z.string().nullable().optional(),
    branch_code: z.string().nullable().optional(),
    bank_account_number: z.string().nullable().optional(),
    is_company_account: z.boolean().optional(),
    company_account: fieldNull,
    //for redirect after creation
    _go_back: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    validateRequiredField({
      data: {
        party: data.is_company_account == false && !data.party?.id,
        partyType: data.is_company_account == false && !data.partyType,
      },
      ctx: ctx,
    });
    if (data.is_company_account) {
      data.party = undefined;
    } else {
      data.company_account = undefined;
    }
  });

export const mapToBankAccountData = (e: BankAccountType) => {
  const d: components["schemas"]["BankAccountData"] = {
    fields: {
      account_name: e.account_name,
      bank_account_type: e.bank_account_type,
      bank_account_number: e.bank_account_number,
      branch_code: e.branch_code,
      iban: e.iban,
      bank_id: e.bank.id || 0,
      party_id: e.party?.id || null,
      is_company_account: e.is_company_account || false,
      company_account_id: e.company_account?.id,
    },
    id: e.id || 0,
  };
  return d;
};
