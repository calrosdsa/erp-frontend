import { z } from "zod";
import { MAX_LENGTH, MIN_LENGTH } from "~/constant";


export  const createTaxSchema = z.object({
    name:z.string().min(MIN_LENGTH).max(MAX_LENGTH),
    value:z.preprocess((a)=>parseFloat(z.string().parse(a)),z.number()),
    enabled:z.boolean(),
})