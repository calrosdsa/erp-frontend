import { create } from "zustand";
import { DealData } from "~/util/data/schemas/crm/deal.schema";

interface Payload extends DealData {
  onSave?: () => void;
  data?: Partial<DealData>;
  onCancel?: () => void;
  enableEdit?: boolean;
  open?: boolean;
}

interface DealStore {
  // Combining a partial DealData with an optional isNew flag.
  payload: Partial<Payload>;
  setData: (update: Partial<DealData>) => void;
  editPayload: (update: Partial<Payload>) => void;
}

export const useDealStore = create<DealStore>((set) => ({
  // Optionally, you could initialize isNew if needed, e.g., { isNew: false }
  payload: {
    enableEdit: false,
  },
  setData: (update) =>
    set((state) => ({
      payload: {
        enableEdit:true,
        data: update, // Apply new updates
      },
    })),
  editPayload: (update) =>
    set((state) => ({
      payload: {
        ...state.payload,
        ...update, // Apply new updates
      },
    })),
}));
