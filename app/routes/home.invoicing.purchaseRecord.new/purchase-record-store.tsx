import { create } from "zustand"



interface Payload {
    supplierID?:number
    supplier?:string
    invoiceCode?:string
    invoiceID?:number
}

interface PurchaseRecordStore {
    payload:Payload
    setPayload:(e:Payload)=>void
}


export const usePurchaseRecordStore = create<PurchaseRecordStore>((set)=>({
    payload:{},
    setPayload:(e)=>set({
        payload:e
    })
}))