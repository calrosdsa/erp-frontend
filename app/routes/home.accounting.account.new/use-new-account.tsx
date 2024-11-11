import { create } from "zustand";


interface Payload {
    parentName?:string
    parentUUID?:string
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