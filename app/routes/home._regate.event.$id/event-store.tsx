import { create } from "zustand";
import { components } from "~/sdk";

interface EventStore {
  newEvent?: components["schemas"]["EventBookingDto"];
  onCreateEvent: (e?: components["schemas"]["EventBookingDto"]) => void;
  reset: () => void;
}

export const useEventStore = create<EventStore>((set) => ({
  onCreateEvent: (e) =>
    set({
      newEvent: e,
    }),
  reset: () =>
    set({
      newEvent: undefined,
    }),
}));
