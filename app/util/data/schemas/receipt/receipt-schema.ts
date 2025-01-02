import { z } from "zod";
import { supplierDtoSchema } from "../buying/supplier-schema";
import { currencySchema } from "../app/currency-schema";
import {
  lineItemSchema,
  lineItemReceipt,
  deliveryLineItem,
} from "../stock/line-item-schema";
import { ItemLineType, PartyType, partyTypeToJSON } from "~/gen/common";
import { taxAndChargeSchema } from "../accounting/tax-and-charge-schema";
import { field, fieldNull } from "..";

export const receiptDataSchema = z
  .object({
    id:z.number().optional(),
    referenceID: z.number().optional(),
    receiptPartyType: z.string(),
    party: field.optional(),
    
    // name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    postingDate: z.date(),
    postingTime: z.string(),
    tz: z.string(),
    currency: z.string(),

    acceptedWarehouseName: z.string().optional(),
    acceptedWarehouseID: z.number().optional(),
    rejectedWarehouseName: z.string().optional(),
    rejectedWarehouseID: z.number().optional(),

    sourceWarehouse: z.number().optional(),
    sourceWarehouseName: z.string().optional(),

   project: fieldNull,
    costCenter: fieldNull,
    priceList: fieldNull,

    lines: z.array(lineItemSchema),
    taxLines: z.array(taxAndChargeSchema),
  })
  .superRefine((data, ctx) => {

    if (data.acceptedWarehouseName && data.acceptedWarehouseID) {
      data.lines = data.lines.map((t, i) => {
        const lineReceipt: z.infer<typeof lineItemReceipt> = {
          acceptedQuantity: t.lineItemReceipt?.acceptedQuantity || 0,
          rejectedQuantity: t.lineItemReceipt?.rejectedQuantity || 0,
          acceptedWarehouseID:
            t.lineItemReceipt?.acceptedWarehouseID || data.acceptedWarehouseID,
          acceptedWarehouse:
            t.lineItemReceipt?.acceptedWarehouse ||
            data.acceptedWarehouseName,
          rejectedWarehouseID:
            t.lineItemReceipt?.rejectedWarehouseID || data.rejectedWarehouseID,
          rejectedWarehouse:
            t.lineItemReceipt?.rejectedWarehouse ||
            data.rejectedWarehouseName,
        };
        t.lineItemReceipt = lineReceipt;
        return t;
      });
    } else if (
      data.receiptPartyType == partyTypeToJSON(PartyType.purchaseReceipt)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: {
          i18n: { key: "custom.required" },
        },
        path: ["acceptedWarehouseName"],
      });
    }

    //For sale invoice
    if (data.sourceWarehouse && data.sourceWarehouseName) {
      data.lines = data.lines.map((t, i) => {
        const deliveryLine: z.infer<typeof deliveryLineItem> = {
          sourceWarehouseID: data.sourceWarehouse,
          sourceWarehouse: data.sourceWarehouseName,
        };
        t.deliveryLineItem = deliveryLine;
        return t;
      });
    } else if (
      data.receiptPartyType == partyTypeToJSON(PartyType.saleInvoice)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: {
          i18n: { key: "custom.required" },
        },
        path: ["sourceWarehouseName"],
      });
    }
  });
// E

export const editReceiptSchema = z.object({
  id: z.number(),
  partyName: z.string(),
  partyID: z.number(),

  postingDate: z.date(),
  postingTime: z.string(),
  tz: z.string(),
  currency: z.string(),

  projectName: z.string().optional(),
  projectID: z.number().optional(),

  costCenterName: z.string().optional(),
  costCenterID: z.number().optional(),
});
