import { z } from "zod";

export const itemStockSchemaForm = z.object({
    stock:z.preprocess((a)=>parseInt(z.string().parse(a)),z.number()),
    outOfStockThreshold:z.preprocess((a)=>parseInt(z.string().parse(a)),z.number()),
    itemId:z.number(),
    enabled:z.boolean().default(true),
    warehouseId:z.number(),
    warehouseName:z.string().optional(),
    itemName:z.string().optional(),
})


