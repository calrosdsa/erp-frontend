import { z } from "zod";
import { create } from "zustand";
import { lineItemSchema } from "~/util/data/schemas/stock/line-item-schema";

interface Payload {
    party_name?:string
    party_uuid?:string
    party_type?:string
    currency?:string
    reference?:number
    lines:z.infer<typeof lineItemSchema>[]
}
interface CreateReceipt {
    payload?:Payload
    setData:(opts:{
        payload?:Payload,
    })=>void
    
}
export const useCreateReceipt = create<CreateReceipt>((set)=>({
    payload:undefined,
    setData:(opts)=>set((state)=>({
        payload:opts.payload
    }))
}))