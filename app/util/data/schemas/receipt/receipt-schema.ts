import { z } from "zod";
import { supplierDtoSchema } from "../buying/supplier-schema";
import { currencySchema } from "../app/currency-schema";
import { lineItemSchema } from "../stock/item-line-schema";

export const createReceiptSchema = z.object({
    partyType:z.string(),
    partyUuid:z.string(),
    partyName:z.string(),

    order_uuid:z.string().optional(),
    // name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    postingDate: z.date(),
    currencyName: z.string(),

    acceptedWarehouseName:z.string(),
    acceptedWarehouse:z.string(),
    rejectedWarehouseName:z.string().optional(),
    rejectedWarehouse:z.string().optional(),

    currency: currencySchema,
    lines: z.array(lineItemSchema),
  });

