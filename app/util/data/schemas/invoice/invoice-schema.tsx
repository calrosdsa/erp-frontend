import { z } from "zod";
import { supplierDtoSchema } from "../buying/supplier-schema";
import { currencySchema } from "../app/currency-schema";
import { deliveryLineItem, lineItemReceipt, lineItemSchema } from "../stock/line-item-schema";
import { taxAndChargeSchema } from "../accounting/tax-and-charge-schema";
import { PartyType, partyTypeToJSON } from "~/gen/common";

export const createInvoiceSchema = z
  .object({
    invoicePartyType:z.string(),
    partyName:z.string(),
    partyID: z.number(),

    referenceID: z.number().optional(),
    // name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    due_date: z.date().optional(),

    postingDate: z.date(),
    postingTime: z.string(),
    tz:z.string(),
    currency: z.string(),
    // recordNo:z.string().optional(),

    updateStock: z.boolean().optional(),

    sourceWarehouse: z.number().optional(),
    sourceWarehouseName: z.string().optional(),

    acceptedWarehouseID: z.number().optional(),
    acceptedWarehouseName: z.string().optional(),

    rejectedWarehouseID: z.number().optional(),
    rejectedWarehouseName: z.string().optional(),

    projectName:z.string().optional(),
    projectID:z.number().optional(),

    costCenterName:z.string().optional(),
    costCenterID:z.number().optional(),

    lines: z.array(lineItemSchema),
    taxLines: z.array(taxAndChargeSchema),
  })
  .superRefine((data, ctx) => {
    if (data.updateStock) {
      //For purchase invoice 
      if (data.acceptedWarehouseName && data.acceptedWarehouseID) {
        data.lines = data.lines.map((t, i) => {
          const receiptLineItem: z.infer<typeof lineItemReceipt> = {
            acceptedWarehouseID:t.lineItemReceipt?.acceptedWarehouseID || data.acceptedWarehouseID,
            acceptedWarehouse:t.lineItemReceipt?.acceptedWarehouse || data.acceptedWarehouseName,
            rejectedWarehouseID:t.lineItemReceipt?.rejectedWarehouseID || data.rejectedWarehouseID,
            rejectedWarehouse:t.lineItemReceipt?.rejectedWarehouse || data.rejectedWarehouseName,
            acceptedQuantity:t.lineItemReceipt?.acceptedQuantity || t.quantity || 0,
            rejectedQuantity:t.lineItemReceipt?.rejectedQuantity || 0,
          };
          t.lineItemReceipt = receiptLineItem;
          return t;
        });
      } else if(data.invoicePartyType == partyTypeToJSON(PartyType.purchaseInvoice)) {
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
      } else if(data.invoicePartyType == partyTypeToJSON(PartyType.saleInvoice)) {
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



  export const editInvoiceSchema = z.object({
    id:z.number(),
    partyName:z.string(),
    partyID: z.number(),
  
    postingDate: z.date(),
    postingTime: z.string(),
    tz:z.string(),
    dueDate: z.date().optional(),
    currency: z.string(),
    // recordNo:z.string().optional(),
  
    projectName:z.string().optional(),
    projectID:z.number().optional(),
  
    costCenterName:z.string().optional(),
    costCenterID:z.number().optional(),
  })
  