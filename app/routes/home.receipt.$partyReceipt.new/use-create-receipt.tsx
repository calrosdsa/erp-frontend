import { z } from "zod";
import { create } from "zustand";
import { supplierDtoSchema } from "~/util/data/schemas/buying/supplier-schema";
import { createPurchaseInvoiceSchema } from "~/util/data/schemas/invoice/invoice-schema";
import { editLineItemSchema, lineItemSchema } from "~/util/data/schemas/stock/item-line-schema";

interface Payload {
    party_name?:string
    party_uuid?:string
    party_type?:string
    currency?:string
    reference?:number
    lines:z.infer<typeof editLineItemSchema>[]
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