import { z } from "zod";
import { ItemLineType, StockEntryType, stockEntryTypeToJSON } from "~/gen/common";
import { lineItemSchema, lineItemStockEntry } from "./line-item-schema";


export const createStockEntrySchema = z.object({
    postingDate: z.date(),

    currency: z.string(),
      // priceListID: z.number(),
    // priceListName:z.string(),

    stockEntryType:z.enum([
        stockEntryTypeToJSON(StockEntryType.MATERIAL_RECEIPT),
        stockEntryTypeToJSON(StockEntryType.MATERIAL_TRANSFER),
        stockEntryTypeToJSON(StockEntryType.MATERIAL_ISSUE),
    ]),

    sourceWarehouseName:z.string().optional(),
    sourceWarehouse:z.number().optional(),
    targetWarehouseName:z.string().optional(),
    targetWarehouse:z.number().optional(),

    lines: z.array(lineItemSchema),
}).superRefine((data,ctx)=>{
    data.lines = data.lines.map((t,i)=>{
      if(t.lineType == ItemLineType.ITEM_LINE_STOCK_ENTRY){
        const lineReceipt:z.infer<typeof lineItemStockEntry> =  {
          sourceWarehouse: t.lineItemStockEntry?.sourceWarehouse || data.sourceWarehouse,
          sourceWarehouseName: t.lineItemStockEntry?.sourceWarehouseName || data.sourceWarehouseName,
          targetWarehouse: t.lineItemStockEntry?.targetWarehouse || data.targetWarehouse,
          targetWarehouseName: t.lineItemStockEntry?.targetWarehouseName || data.targetWarehouseName,
        }
        t.lineItemStockEntry = lineReceipt
      }
      return t
    })
  })
  // E
  ;