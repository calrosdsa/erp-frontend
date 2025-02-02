import { create } from "zustand";

interface NewBookingPayload {
    court: number;
    courtName: string;  
    selectedSlots:string[]
}
interface NewBookingStore {
  onPayload:(opts:NewBookingPayload)=>void
  resetPayload:()=>void
  payload?:NewBookingPayload
}
export const useNewBooking = create<NewBookingStore>((set) => ({
    payload:undefined,
    onPayload:(opts)=>set((state)=>({
        payload:opts
    })),
    resetPayload:()=>set((state)=>({
        payload:undefined,
    }))
}));
