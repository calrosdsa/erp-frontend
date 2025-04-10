import { create } from "zustand";
import { components } from "~/sdk";

interface Payload {
  activities: components["schemas"]["ActivityDto"][];
}

interface ActivityStore {
  setPayload: (e: Partial<Payload>) => void;
  editPayload: (e: Partial<Payload>) => void;
  addActivity: (activities: components["schemas"]["ActivityDto"]) => void;
  payload: Partial<Payload>;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  payload: {},
  setPayload: (e) =>
    set({
      payload: e,
    }),
  editPayload: (e) =>
    set((state) => ({
      payload: { ...state.payload, ...e },
    })),
  addActivity: (e) =>
    set((state) => ({
      payload: {
        ...state.payload,
        activities: [e,...(state.payload.activities || [])],
      },
    })),
}));
