import { z } from "zod";
import { components } from "~/sdk";


export const createPriceListSchema = z.object({
    name:z.string().min(3).max(50),
    currency:z.string().min(2).max(3),
    isBuying:z.boolean().default(false),
    isSelling:z.boolean().default(false),
})

export const priceListSchema = z.object({
    name:z.string(),
    uuid:z.string(),
})

export const priceListSchemaToPriceListDto = (d:z.infer<typeof priceListSchema>):components["schemas"]["PriceListDto"] =>{
    return {
        name:d.name,
        uuid:d.uuid,
        is_buying:false,
        is_selling:false,
        created_at:"",
        currency:"",
    }
}