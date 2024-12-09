import { z } from "zod";
import {
  ItemLineType,
  StockEntryType,
  stockEntryTypeToJSON,
} from "~/gen/common";
import { lineItemSchema, lineItemStockEntry } from "./line-item-schema";

export const createStockEntrySchema = z
  .object({
    postingDate: z.date(),
    postingTime: z.string(),
    tz: z.string(),
    currency: z.string(),
    // priceListID: z.number(),
    // priceListName:z.string(),

    entryType: z.string(),

    sourceWarehouse: z.string().optional(),
    sourceWarehouseID: z.number().optional(),
    targetWarehouse: z.string(),
    targetWarehouseID: z.number().optional(),

    projectName:z.string().optional(),
    projectID:z.number().optional(),

    costCenterName:z.string().optional(),
    costCenterID:z.number().optional(),

    items: z.array(lineItemSchema),
  })
  .superRefine((data, ctx) => {
    if (data.items.length == 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: {
          i18n: { key: "custom.required" },
        },
        path: ["items"],
      });
    }
    data.items = data.items.map((t, i) => {
      if (t.lineType == ItemLineType.ITEM_LINE_STOCK_ENTRY) {
        const lineReceipt: z.infer<typeof lineItemStockEntry> = {
          sourceWarehouse:
            t.lineItemStockEntry?.sourceWarehouse || data.sourceWarehouseID,
          sourceWarehouseName:
            t.lineItemStockEntry?.sourceWarehouseName || data.sourceWarehouse,
          targetWarehouse:
            t.lineItemStockEntry?.targetWarehouse || data.targetWarehouseID,
          targetWarehouseName:
            t.lineItemStockEntry?.targetWarehouseName || data.targetWarehouse,
        };
        t.lineItemStockEntry = lineReceipt;
      }
      return t;
    });
  });
// E

export const editStockEntrySchema = z.object({
  id: z.number(),
  postingDate: z.date(),
  postingTime: z.string(),
  tz: z.string(),
  currency: z.string(),
  // priceListID: z.number(),
  // priceListName:z.string(),
  projectName: z.string().optional(),
  projectID: z.number().optional(),

  costCenterName: z.string().optional(),
  costCenterID: z.number().optional(),
  entryType: z.string(),
});
