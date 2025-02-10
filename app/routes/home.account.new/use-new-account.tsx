import { create } from "zustand";


interface Payload {
    parentName?:string
    parentID?:number
}

interface NewAccountStore {
    payload?:Payload
    setPayload:(payload:Payload)=>void
}

export const useNewAccount = create<NewAccountStore>((set)=>({
    setPayload:(e)=>set({
        payload:e
    })
}))