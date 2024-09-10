import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { supplierDtoSchema } from "./supplier-schema";

export const itemPriceDtoSchema = z.object({
  code: z.string(),
  uuid: z.string(),
  rate: z.number(),
  item_quantity: z.number(),
  item_name: z.string(),
  item_code:z.string(),
  uom: z.string(),
});

export const orderLineSchema = z.object({
  item_price:itemPriceDtoSchema,  
  quantity:z.preprocess((a)=>parseFloat(z.string().parse(a)),z.number()),
  amount: z.number().optional(),
});

export const createPurchaseSchema = z.object({
  supplier: supplierDtoSchema,
  supplierName: z.string(),
  name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
  delivery_date: z.date().optional(),
  currencyName: z.string(),
  currency: z.string(),
  lines: z.array(orderLineSchema),
});
