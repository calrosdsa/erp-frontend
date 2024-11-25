import { z } from "zod";
import { supplierDtoSchema } from "../buying/supplier-schema";
import { currencySchema } from "../app/currency-schema";
import { deliveryLineItem, lineItemSchema } from "../stock/line-item-schema";

export const createInvoiceSchema = z
  .object({
    partyType: z.string(),
    partyUuid: z.string(),
    partyName: z.string(),

    referenceID: z.number().optional(),
    // name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    due_date: z.date().optional(),
    date: z.date(),
    currencyName: z.string(),
    currency: z.string(),

    updateStock: z.boolean().optional(),

    sourceWarehouse: z.number().optional(),
    sourceWarehouseName: z.string().optional(),

    lines: z.array(lineItemSchema),
  })
  .superRefine((data, ctx) => {
    if (data.updateStock) {
      if (data.sourceWarehouse && data.sourceWarehouseName) {
        data.lines = data.lines.map((t, i) => {
          const deliveryLine: z.infer<typeof deliveryLineItem> = {
            sourceWarehouse: data.sourceWarehouse,
            sourceWarehouseName: data.sourceWarehouseName,
          };
          t.deliveryLineItem = deliveryLine;
          return t;
        });
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            i18n: { key: "custom.required" },
          },
          path: ["sourceWarehouseName"],
        });
      }
    }
  });
// E
