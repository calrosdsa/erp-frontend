import { z } from "zod";
import { create } from "zustand";
import { orderLineSchema } from "~/util/data/schemas/buying/purchase-schema";
import { supplierDtoSchema } from "~/util/data/schemas/buying/supplier-schema";
import { createPurchaseInvoiceSchema } from "~/util/data/schemas/invoice/invoice-schema";

interface Payload {
    party_name?:string
    party_uuid?:string
    currency?:string
    order_uuid?:string
    lines:z.infer<typeof orderLineSchema>[]
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