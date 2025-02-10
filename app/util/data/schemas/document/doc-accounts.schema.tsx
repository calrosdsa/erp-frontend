import { z } from "zod";
import { components } from "~/sdk";
import { fieldNull } from "..";

export type DocAccountsType = z.infer<typeof docAccountsSchema>

export const docAccountsSchema = z.object({
    doc_id:z.number(),
    doc_party_type:z.string(),
    credit_account:fieldNull,
    debit_account:fieldNull,
    
})

export const mapToDocAccountsData  = (e:DocAccountsType) =>{
    const d:components["schemas"]["DocAccountingData"] = {
        fields: {
            credit_account_id:e.credit_account?.id,
            debit_account_id:e.debit_account?.id,
        },
        doc_id: e.doc_id,
        doc_party_type:e.doc_party_type,
    }
    return d
}