import { z } from "zod";
import { create } from "zustand";
import { editLineItemSchema, lineItemSchema } from "~/util/data/schemas/stock/item-line-schema";

interface Payload {
    party_name?:string
    party_uuid?:string
    party_type?:string
    currency?:string
    referenceID?:number
    lines:z.infer<typeof editLineItemSchema>[]
}
interface CreatePurchaseInvoiceStore {
    payload?:Payload
    setData:(opts:{
        payload?:Payload,
    })=>void
    
}
export const useCreatePurchaseInvoice = create<CreatePurchaseInvoiceStore>((set)=>({
    payload:undefined,
    setData:(opts)=>set((state)=>({
        payload:opts.payload
    }))
}))