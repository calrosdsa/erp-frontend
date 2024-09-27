import { z } from "zod";
import { supplierDtoSchema } from "../buying/supplier-schema";
import { currencySchema } from "../app/currency-schema";
import { orderLineSchema } from "../buying/purchase-schema";

export const createPurchaseInvoiceSchema = z.object({
    supplier: supplierDtoSchema,
    supplierName: z.string(),
    // name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    due_date: z.date().optional(),
    date: z.date(),
    currencyName: z.string(),
    currency: currencySchema,
    lines: z.array(orderLineSchema),
  });