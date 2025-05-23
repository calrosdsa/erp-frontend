import { create } from "zustand";
import { OrderSchema } from "~/util/data/schemas/buying/order-schema";

interface OrderStore {
  payload: Partial<OrderSchema>;
  onPayload: (e: Partial<OrderSchema>) => void;
}
export const useOrderStore = create<OrderStore>((set) => ({
  payload: {},
  onPayload: (e) =>
    set({
      payload: e,
    }),
}));
