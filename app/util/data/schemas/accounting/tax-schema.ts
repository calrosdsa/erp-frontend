import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";


export  const createTaxSchema = z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    value:z.preprocess((a)=>parseFloat(z.string().parse(a)),z.number()),
    enabled:z.boolean(),
})

export const taxSchema = z.object({
    name:z.string(),
    uuid:z.string(),
})