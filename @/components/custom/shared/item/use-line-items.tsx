import { z } from "zod";
import { create } from "zustand";
import { lineItemSchema } from "~/util/data/schemas/stock/line-item-schema";

interface LineItems {
  lines: z.infer<typeof lineItemSchema>[];
  total: number;
  totalQuantity: number;
  reset: () => void;
  onLines: (lines: z.infer<typeof lineItemSchema>[]) => void;
}

export const useLineItems = create<LineItems>((set) => ({
  lines: [],
  total: 0,
  totalQuantity: 0,
  reset: () => set({ lines: [], total: 0, totalQuantity: 0 }),
  onLines: (lines) => set({
    lines,
    total: lines.reduce((sum, { quantity, rate }) => sum + Number(quantity) * rate, 0),
    totalQuantity: lines.reduce((sum, { quantity }) => sum + Number(quantity), 0),
  }),
}));