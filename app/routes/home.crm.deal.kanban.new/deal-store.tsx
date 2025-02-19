import { create } from "zustand";
import { DealData } from "~/util/data/schemas/crm/deal.schema";

interface DealStore {
    payload:Partial<DealData>
    setPayload:(e:Partial<DealData>)=>void
}
export const useDealStore = create<DealStore>((set)=>({
    payload:{},
    setPayload:(e)=>set((state)=>({
        payload:{
            ...e,
            available_for_everyone:true
        }
    }))
}))