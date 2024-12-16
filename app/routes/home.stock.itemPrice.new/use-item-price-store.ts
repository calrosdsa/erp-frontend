import { create } from "zustand"

interface Payload {
    item?:string
    itemID?:number
    uom?:string
    uomID?:number
}

interface ItemPriceStore {
    payload?:Payload
    onPayload:(paylaod:Payload)=>void
}

export const useItemPriceStore = create<ItemPriceStore>((set)=>({
    onPayload:(opts)=> set({
        payload:opts
    })
}))

