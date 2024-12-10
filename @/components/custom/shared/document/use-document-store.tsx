import { create } from "zustand";

interface Payload {
  partyName?: string;
  partyID?: number;
  documentRefernceID?: number;
  currency?: string;
  projectID?: number;
  projectName?: string;
  costCenterID?: number;
  costCenterName?: string;
  docPartyType?: string;
}
interface DocumentStore {
  payload?: Payload;
  setData: (opts: Payload) => void;
  reset: () => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  setData: (opts) =>
    set((state) => ({
      payload: opts,
    })),
  reset: () =>
    set({
      payload: undefined,
    }),
}));
