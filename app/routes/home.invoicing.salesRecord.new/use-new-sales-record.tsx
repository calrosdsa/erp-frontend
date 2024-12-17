import { create } from "zustand"


interface Payload  {
    invoiceID?:number
    invoiceCode?:string
    partyID?:number
    party?:string
}

interface NewSalesRecordStore{
    onPayload:(opts:Payload)=>void
    payload?:Payload
}

export const useNewSalesRecord = create<NewSalesRecordStore>((set)=>({
    onPayload:(e)=>set({
        payload:e
    })
}))