import { z } from "zod";
import { create } from "zustand";
import { paymentReferceSchema } from "~/util/data/schemas/accounting/payment-schema";

interface Payload {
    amount:number
    
    partyType?:string
    partyName?:string
    partyID?:number
    paymentType?:string
    partyUuid?:string
    partyReference?:number
    partyReferences:z.infer<typeof paymentReferceSchema>[]
}

interface CreatePaymentStore {
    payload?:Payload
    setData:(payload:Payload)=>void
}

export const useCreatePayment = create<CreatePaymentStore>((set)=>({
    setData:(e)=>set((state)=>({
        payload:e
    }))
}))