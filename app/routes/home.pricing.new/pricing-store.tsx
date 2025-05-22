import { create } from "zustand";
import { PricingSchema } from "~/util/data/schemas/pricing/pricing-schema";



interface PricingStore {
    payload:Partial<PricingSchema>
    onPayload:(e:Partial<PricingSchema>)=>void

}
export const usePricingStore = create<PricingStore>((set)=>({
    payload:{},
    onPayload:(e)=>set({
        payload:e
    })
}));