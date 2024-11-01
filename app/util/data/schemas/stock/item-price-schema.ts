import { z } from "zod";




export const createItemPriceSchema = z.object({
    rate:  z.coerce.number(),
    itemQuantity: z.coerce.number(),

    itemName:z.string(),
    itemUuid:z.string(),
    itemID:z.number(),
    
    priceListUuid:z.string().optional(),
    priceListName:z.string().optional(),
    priceListID:z.number().optional(),

    taxName:z.string().optional(),
    taxUuid:z.string().optional(),
    taxID:z.number().optional(),

    uomName:z.string().optional(),
    uomID:z.number().optional()
    // plugins:z.array(pluginObjectSchema).optional()
})

