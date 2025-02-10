import { create } from "zustand";
import { BankAccountType } from "~/util/data/schemas/accounting/bank-account.schema";
import { CashOutflowDataType } from "~/util/data/schemas/accounting/cash-outflow.schema";


interface CashOutflowStore {
    payload:Partial<CashOutflowDataType>,
    setPayload:(e:Partial<CashOutflowDataType>)=>void
}
export const useCashOutflowStore = create<CashOutflowStore>((set)=>({
    payload:{},
    setPayload:(e)=>set({
        payload:e
    })
}))