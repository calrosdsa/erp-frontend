import { z } from "zod";
import { supplierDtoSchema } from "../buying/supplier-schema";
import { currencySchema } from "../app/currency-schema";
import { lineItemSchema } from "../stock/line-item-schema";

export const createPurchaseInvoiceSchema = z.object({
  partyType: z.string(),
  partyUuid: z.string(),
  partyName: z.string(),
  
  referenceID: z.number().optional(),
  // name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
  due_date: z.date().optional(),
  date: z.date(),
  currencyName: z.string(),
  currency: z.string(),
  lines: z.array(lineItemSchema),
});
