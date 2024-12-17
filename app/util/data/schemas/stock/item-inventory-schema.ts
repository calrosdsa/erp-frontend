import { z } from "zod";

export const itemInventory = z.object({
    shelfLifeInDays:z.coerce.number().optional().nullable(),
    warrantyPeriodInDays:z.coerce.number().optional().nullable(),
    hasSerialNo:z.boolean().optional().nullable(),
    serialNoTemplate:z.string().optional().nullable(),
    weightUomID:z.number().optional().nullable(),
    weightUom:z.string().optional().nullable(),
    wightPerUnit:z.coerce.number().optional().nullable(),
})

export const editItemInventory = z.object({
    itemID:z.number(),
    shelfLifeInDays:z.coerce.number().optional().nullable(),
    warrantyPeriodInDays:z.coerce.number().optional().nullable(),
    hasSerialNo:z.boolean().optional().nullable(),
    serialNoTemplate:z.string().optional().nullable(),
    weightUomID:z.number().optional().nullable(),
    weightUom:z.string().optional().nullable(),
    wightPerUnit:z.coerce.number().optional().nullable(),
})