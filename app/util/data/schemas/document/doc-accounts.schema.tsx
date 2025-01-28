import { z } from "zod";
import { components } from "~/sdk";

export type DocAccountsType = z.infer<typeof docAccountsSchema>

export const docAccountsSchema = z.object({
    doc_id:z.number(),
    doc_party_type:z.string(),
    payable_account_id:z.number().nullable().optional(),
    payable_account:z.string().nullable().optional(),
    cogs_account_id:z.number().nullable().optional(),
    cogs_account:z.string().nullable().optional(),
    receivable_account_id:z.number().nullable().optional(),
    receivable_account:z.string().nullable().optional(),
    income_account_id:z.number().nullable().optional(),
    income_account:z.string().nullable().optional(),
    inventory_account_id:z.number().nullable().optional(),
    inventory_account:z.string().nullable().optional(),
    srbnb_account_id:z.number().nullable().optional(),
    srbnb_account:z.string().nullable().optional(),
    
})

export const mapToDocAccountsData  = (e:DocAccountsType) =>{
    const d:components["schemas"]["DocAccountingData"] = {
        fields: {
            payable_account_id:e.payable_account_id,
            cogs_account_id:e.cogs_account_id,
            receivable_account_id:e.receivable_account_id,
            income_account_id:e.income_account_id,
            inventory_account_id:e.income_account_id,
            srbnb_account_id:e.srbnb_account_id,
        },
        doc_id: e.doc_id,
        doc_party_type:e.doc_party_type,
    }
    return d
}