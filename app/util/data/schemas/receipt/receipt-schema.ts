import { z } from "zod";
import { supplierDtoSchema } from "../buying/supplier-schema";
import { currencySchema } from "../app/currency-schema";
import { orderLineSchema } from "../buying/purchase-schema";

export const createReceiptSchema = z.object({
    partyType:z.string(),
    partyUuid:z.string(),

    order_uuid:z.string().optional(),
    // name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    postingDate: z.date(),
    currencyName: z.string(),
    currency: currencySchema,
    lines: z.array(orderLineSchema),
  });

