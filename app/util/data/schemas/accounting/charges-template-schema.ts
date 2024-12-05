import { z } from "zod";
import { taxAndChargeSchema } from "./tax-and-charge-schema";

export const createChargesTemplateSchema = z.object({
    name:z.string(),
    taxLines: z.array(taxAndChargeSchema),
})

export const editChargesTemplateSchema = z.object({
    name:z.string(),
    id:z.number()
})