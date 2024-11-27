import { z } from "zod";
import { lineItemSchema } from "../stock/line-item-schema";
import { taxAndChargeSchema } from "../accounting/tax-and-charge-schema";

export const createQuotationSchema = z
  .object({
    partyName:z.string(),
    partyID: z.number(),

    postingDate: z.date(),
    postingTime: z.string(),
    tz:z.string(),
    validTill:z.date(),
    currency: z.string(),

    projectName:z.string().optional(),
    projectID:z.number().optional(),

    costCenterName:z.string().optional(),
    costCenterID:z.number().optional(),

    lines: z.array(lineItemSchema),
    taxLines: z.array(taxAndChargeSchema),
  })
  
// E
