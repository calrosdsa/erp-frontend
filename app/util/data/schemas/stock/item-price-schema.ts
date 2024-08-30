import { z } from "zod";
import { pluginObjectSchema } from "../plugin/plugin-schema";


export const itemPriceFormSchema = z.object({
    itemId:z.number(),
    itemName:z.string().optional(),
    rate:z.string(),
    priceListId:z.number(),
    priceListName:z.string(),
    taxName:z.string(),
    itemQuantity:z.string(),
    taxId:z.number(),
    plugins:z.array(pluginObjectSchema).optional()
})

