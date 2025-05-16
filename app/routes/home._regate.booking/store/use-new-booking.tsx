import { create } from "zustand";

interface NewBookingPayload {
  court: number;
  courtName: string;
  slots: string[];
}
interface NewBookingStore {
  onPayload: (opts: Partial<NewBookingPayload>) => void;
  resetPayload: () => void;
  payload?: Partial<NewBookingPayload>;
  selectedSlots:Set<string>;
  setSelectedSlots:(e:Set<string>)=>void;
}
export const useNewBooking = create<NewBookingStore>((set) => ({
  payload: undefined,
  selectedSlots:new Set(),
  setSelectedSlots:(e:Set<string>)=>{
    set({
        selectedSlots:e
    })
  },
  onPayload: (opts) =>
    set((state) => ({
      payload: {
        ...state,
        ...opts,
      },
    })),
  resetPayload: () =>
    set((state) => ({
      payload: undefined,
    })),
}));
