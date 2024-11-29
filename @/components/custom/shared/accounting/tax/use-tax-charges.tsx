import { z } from "zod";
import { create } from "zustand";
import { taxAndChargeSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";

interface TaxAndChargesStore {
  lines: z.infer<typeof taxAndChargeSchema>[];
  totalDeducted: number;
  totalAdded: number;
  total: number;
  reset: () => void;
  onLines: (lines: z.infer<typeof taxAndChargeSchema>[]) => void;
}

export const useTaxAndCharges = create<TaxAndChargesStore>((set) => ({
  lines: [],
  totalDeducted: 0,
  totalAdded: 0,
  total: 0,
  reset: () => set({ lines: [], totalDeducted: 0, totalAdded: 0, total: 0 }),
  onLines: (lines) => {
    const totalDeducted = lines.filter(t => t.isDeducted).reduce((sum, t) => sum + Number(t.amount), 0);
    const totalAdded = lines.filter(t => !t.isDeducted).reduce((sum, t) => sum + Number(t.amount), 0);
    return set({ lines, totalDeducted, totalAdded, total: totalAdded - totalDeducted });
  },
}));