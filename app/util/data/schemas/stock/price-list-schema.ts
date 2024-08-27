import { z } from "zod";


export const createPriceListSchema = z.object({
    name:z.string().min(3).max(50),
    currency:z.string().min(2).max(3),
    isBuying:z.boolean(),
    isSelling:z.boolean(),
})