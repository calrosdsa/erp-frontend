import { create } from "zustand"

interface Payload {
    netTotal:number
}
interface TotalStore {
    payload?:Payload
    onPayload:(opts:Payload)=>void
}
export const useTotal = create<TotalStore>((set)=>({
    onPayload:(opts)=>set((state)=>({
        payload:opts
    }))
}))