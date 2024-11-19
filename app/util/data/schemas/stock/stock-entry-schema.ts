import { z } from "zod";
import { StockEntryType, stockEntryTypeToJSON } from "~/gen/common";
import { editLineItemSchema } from "./item-line-schema";


export const createStockEntrySchema = z.object({
    postingDate: z.date(),
    priceListID: z.number(),
    priceListName:z.string(),

    stockEntryType:z.enum([
        stockEntryTypeToJSON(StockEntryType.MATERIAL_RECEIPT),
        stockEntryTypeToJSON(StockEntryType.MATERIAL_TRANSFER),
        stockEntryTypeToJSON(StockEntryType.MATERIAL_ISSUE),
    ]),

    sourceWarehouseName:z.string().optional(),
    sourceWarehouse:z.number().optional(),
    targetWarehouseName:z.string().optional(),
    targetWarehouse:z.number().optional(),

    lines: z.array(editLineItemSchema),
})