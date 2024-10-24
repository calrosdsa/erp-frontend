import { create } from "zustand";

interface Payload {
    amount:number
    
    partyType?:string
    partyName?:string
    partyUuid?:string
    partyReference?:number
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