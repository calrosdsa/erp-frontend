import { create } from "zustand";
import { components } from "~/sdk";

interface ItemStore {
  newItem?: components["schemas"]["ItemDto"];
  onCreateItem: (e?: components["schemas"]["ItemDto"]) => void;
  reset: () => void;
}

export const useItemStore = create<ItemStore>((set) => ({
  onCreateItem: (e) =>
    set({
      newItem: e,
    }),
  reset: () =>
    set({
      newItem: undefined,
    }),
}));
