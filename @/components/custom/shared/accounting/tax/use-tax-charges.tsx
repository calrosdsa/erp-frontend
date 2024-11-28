import { z } from "zod";
import { create } from "zustand";
import { components } from "~/sdk";
import { taxAndChargeSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";

interface TaxAndChargesStore {
  onLines: (lines: z.infer<typeof taxAndChargeSchema>[]) => void;
  totalDeducted: number;
  totalAdded: number;
  total: number;
  lines: z.infer<typeof taxAndChargeSchema>[];
}
export const useTaxAndCharges = create<TaxAndChargesStore>((set) => ({
  lines: [],
  totalDeducted: 0,
  totalAdded: 0,
  total: 0,
  onLines: (e) =>
    set((state) => {
      const totalDeducted = e
        .filter((t) => t.isDeducted)
        .reduce((prev, curr) => prev + Number(curr.amount), 0);
      const totalAdded = e
        .filter((t) => !t.isDeducted)
        .reduce((prev, curr) => prev + Number(curr.amount), 0);
      const total = totalAdded - totalDeducted
      return {
        lines: e,
        totalDeducted:totalDeducted,
        totalAdded:totalAdded,
        total:total, 
      };
    }),
}));
