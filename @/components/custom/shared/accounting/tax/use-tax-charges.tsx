import { z } from "zod";
import { create } from "zustand";
import { TaxChargeLineType, taxChargeLineTypeToJSON } from "~/gen/common";
import { taxAndChargeSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { lineItemSchema } from "~/util/data/schemas/stock/line-item-schema";

interface TaxAndChargesStore {
  lines: z.infer<typeof taxAndChargeSchema>[];
  totalDeducted: number;
  totalAdded: number;
  total: number;
  reset: () => void;
  onLines: (lines: z.infer<typeof taxAndChargeSchema>[]) => void;
  updateFromItems: (items: z.infer<typeof lineItemSchema>[]) => void;
}

export const useTaxAndCharges = create<TaxAndChargesStore>((set) => ({
  lines: [],
  totalDeducted: 0,
  totalAdded: 0,
  total: 0,
  reset: () => set({ lines: [], totalDeducted: 0, totalAdded: 0, total: 0 }),
  updateFromItems: (lines) => {
    const total = lines.reduce(
      (prev, curr) => prev + (curr.quantity || 0) * curr.rate,
      0
    );
    return set((state) => {
      const taxLines = state.lines.map((t) => {
        if (t.type == taxChargeLineTypeToJSON(TaxChargeLineType.ON_NET_TOTAL)) {
          t.amount = total * ((t.taxRate || 1) / 100);
        }
        return t;
      });
      const totalDeducted = taxLines
        .filter((t) => t.isDeducted)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const totalAdded = taxLines
        .filter((t) => !t.isDeducted)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      return {
        lines: taxLines,
        total:totalAdded - totalDeducted,
        totalDeducted,
        totalAdded
      };
    });
  },
  onLines: (lines) => {
    const totalDeducted = lines
      .filter((t) => t.isDeducted)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalAdded = lines
      .filter((t) => !t.isDeducted)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return set({
      lines,
      totalDeducted,
      totalAdded,
      total: totalAdded - totalDeducted,
    });
  },
}));
