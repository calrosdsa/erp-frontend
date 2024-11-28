import { z } from "zod";
import { supplierDtoSchema } from "../buying/supplier-schema";
import { currencySchema } from "../app/currency-schema";
import { deliveryLineItem, lineItemSchema } from "../stock/line-item-schema";
import { taxAndChargeSchema } from "../accounting/tax-and-charge-schema";

export const createInvoiceSchema = z
  .object({
    partyName:z.string(),
    partyID: z.number(),

    referenceID: z.number().optional(),
    // name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    due_date: z.date().optional(),

    postingDate: z.date(),
    postingTime: z.string(),
    tz:z.string(),
    currency: z.string(),

    updateStock: z.boolean().optional(),

    sourceWarehouse: z.number().optional(),
    sourceWarehouseName: z.string().optional(),

    projectName:z.string().optional(),
    projectID:z.number().optional(),

    costCenterName:z.string().optional(),
    costCenterID:z.number().optional(),


    lines: z.array(lineItemSchema),
    taxLines: z.array(taxAndChargeSchema),
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
