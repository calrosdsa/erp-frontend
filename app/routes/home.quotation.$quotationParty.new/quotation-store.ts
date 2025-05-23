import { create } from "zustand";
import { QuotationSchema } from "~/util/data/schemas/quotation/quotation-schema";

interface QuotationStore {
  payload: Partial<QuotationSchema>;
  onPayload: (e: Partial<QuotationSchema>) => void;
}

export const useQuotationStore = create<QuotationStore>((set) => ({
  payload: {},
  onPayload: (e) =>
    set({
      payload: {
        ...e,
        taxLines: e.taxLines ? e.taxLines : [],
        lines: e.lines ? e.lines : [],
      },
    }),
}));
