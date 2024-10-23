import { z } from "zod";
import { supplierDtoSchema } from "../buying/supplier-schema";
import { currencySchema } from "../app/currency-schema";
import { editLineItemSchema, lineItemReceipt } from "../stock/item-line-schema";
import { ItemLineType } from "~/gen/common";

export const createReceiptSchema = z.object({

    partyType:z.string(),
    partyUuid:z.string(),
    partyName:z.string(),

    reference:z.number().optional(),
    // name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    postingDate: z.date(),
    currencyName: z.string(),

    acceptedWarehouseName:z.string(),
    acceptedWarehouse:z.number(),
    rejectedWarehouseName:z.string().optional(),
    rejectedWarehouse:z.number().optional(),

    currency: currencySchema,
    lines: z.array(editLineItemSchema),
  }).superRefine((data,ctx)=>{
    data.lines = data.lines.map((t,i)=>{
      if(t.lineType == ItemLineType.ITEM_LINE_RECEIPT){
        const lineReceipt:z.infer<typeof lineItemReceipt> =  {
          acceptedQuantity: t.lineItemReceipt?.acceptedQuantity || 0,
          rejectedQuantity: t.lineItemReceipt?.rejectedQuantity || 0,
          acceptedWarehouse: t.lineItemReceipt?.acceptedWarehouse || data.acceptedWarehouse,
          acceptedWarehouseName: t.lineItemReceipt?.acceptedWarehouseName || data.acceptedWarehouseName,
          rejectedWarehouse: t.lineItemReceipt?.rejectedWarehouse || data.rejectedWarehouse,
          rejectedWarehouseName: t.lineItemReceipt?.rejectedWarehouseName || data.rejectedWarehouseName,
        }
        t.lineItemReceipt = lineReceipt
      }
      return t
    })
  })
  // E
  ;

