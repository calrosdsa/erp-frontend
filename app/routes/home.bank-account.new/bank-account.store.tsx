import { create } from "zustand";
import { BankAccountType } from "~/util/data/schemas/accounting/bank-account.schema";


interface BankAccountStore {
    payload:Partial<BankAccountType>,
    setPayload:(e:Partial<BankAccountType>)=>void
}
export const useBankAccountStore = create<BankAccountStore>((set)=>({
    payload:{
        is_company_account:false,
    },
    setPayload:(e)=>set({
        payload:e
    })
}))