import { create } from "zustand"
import { PurchaseRecordDataType } from "~/util/data/schemas/invoicing/purchase-record-schema"




interface PurchaseRecordStore {
    payload:Partial<PurchaseRecordDataType>
    setPayload:(e:Partial<PurchaseRecordDataType>)=>void
}


export const usePurchaseRecordStore = create<PurchaseRecordStore>((set)=>({
    payload:{},
    setPayload:(e)=>set({
        payload:e
    })
}))