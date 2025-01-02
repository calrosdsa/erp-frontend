import { create } from "zustand";

interface Payload {
  partyName?: string;
  partyID?: number;
  documentRefernceID?: number;
  currency?: string;
  priceListID?: number | null;
  priceListName?: string | null;
  projectID?: number | null;
  projectName?: string | null;
  costCenterID?: number | null;
  costCenterName?: string | null;
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
