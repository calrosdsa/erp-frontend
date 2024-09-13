import { z } from "zod";

export const addStockLevelSchema = z.object({
    stock:z.preprocess((a)=>parseInt(z.string().parse(a)),z.number()),
    outOfStockThreshold:z.preprocess((a)=>parseInt(z.string().parse(a)),z.number()),
    enabled:z.boolean().default(true),
    warehouseUuid:z.string(),
    warehouseName:z.string().optional(),
    itemUuid:z.string(),
    itemName:z.string().optional(),
})


