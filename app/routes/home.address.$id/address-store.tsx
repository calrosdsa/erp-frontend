import { create } from "zustand";
import { components } from "~/sdk";

interface AddressStore {
  newAddress?: components["schemas"]["AddressDto"];
  onCreateAddress: (e?: components["schemas"]["AddressDto"]) => void;
  reset: () => void;
}

export const useAddressStore = create<AddressStore>((set) => ({
  onCreateAddress: (e) =>
    set({
      newAddress: e,
    }),
  reset: () =>
    set({
      newAddress: undefined,
    }),
}));
