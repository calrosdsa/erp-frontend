import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { supplierDtoSchema } from "./supplier-schema";

export const orderLineSchema = z.object({
    item_price_id:z.number(),
    quantity:z.string(),
})

export const createPurchaseSchema = z.object({
    supplier:supplierDtoSchema,
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    delivery_date:z.string().optional(),
    currency:z.string(),
    lines:z.array(orderLineSchema),
})