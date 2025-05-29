import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { create } from "zustand";
import { components } from "~/sdk";

interface CustomerStore {
  newCustomer?: components["schemas"]["CustomerDto"];
  onCreateCustomer: (e?: components["schemas"]["CustomerDto"]) => void;
  reset: () => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  onCreateCustomer: (e) =>
    set({
      newCustomer: e,
    }),
  reset: () =>
    set({
      newCustomer: undefined,
    }),
}));



