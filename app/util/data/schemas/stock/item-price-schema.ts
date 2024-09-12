import { z } from "zod";




export const createItemPriceSchema = z.object({
    rate: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number()),
    itemQuantity: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number()),
    priceListName:z.string(),
    taxName:z.string(),
    itemName:z.string(),
    priceListUuid:z.string(),
    taxUuid:z.string(),
    itemUuid:z.string(),
    // plugins:z.array(pluginObjectSchema).optional()
})

