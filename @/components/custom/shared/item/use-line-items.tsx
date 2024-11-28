import { z } from "zod";
import { create } from "zustand";
import { components } from "~/sdk";
import { lineItemSchema } from "~/util/data/schemas/stock/line-item-schema";


interface LineItems {
  onLines: (lines: z.infer<typeof lineItemSchema>[]) => void;
  total: number;
  totalQuantity:number;
  lines: z.infer<typeof lineItemSchema>[];
}
export const useLineItems = create<LineItems>((set) => ({
  lines:[],
  total:0,
  totalQuantity:0,
  onLines: (lines) =>
    set((state) => ({
      lines: lines,
      total: lines.reduce(
        (prev, curr) => prev + Number(curr.quantity) * curr.rate,
        0
      ),
      totalQuantity:lines.reduce((prev,curr)=>prev +Number(curr.quantity),0),
    })),
}));
