import { z } from "zod";




export const createItemPriceSchema = z.object({
    rate:  z.coerce.number(),
    itemQuantity: z.coerce.number(),

    item:z.string(),
    itemID:z.number(),
    
    priceList:z.string(),
    priceListID:z.number(),

    uom:z.string(),
    uomID:z.number()
})


export const editItemPriceSchema = z.object({
    id:z.number(),
    rate:  z.coerce.number(),
    itemQuantity: z.coerce.number(),

    item:z.string(),
    itemID:z.number(),
    
    priceList:z.string(),
    priceListID:z.number(),

    uom:z.string(),
    uomID:z.number()
})
