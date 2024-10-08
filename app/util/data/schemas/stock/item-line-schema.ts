import { z } from "zod";
import { ItemLineType } from "~/gen/common";


export const itemPriceDtoSchema = z.object({
    code: z.string().optional(),
    uuid: z.string().optional(),
    rate: z.number(),
    item_quantity: z.number().optional(),
    item_name: z.string().optional(),
    item_code: z.string().optional(),
    item_uuid: z.string().optional(),
    uom: z.string().optional(),
    tax_name:z.string().optional(),
    tax_uuid:z.string().optional(),
    tax_value:z.number().optional(),
  });
  
  

export const lineItemReceipt = z.object({
    acceptedQuantity:  z.union([z.number().positive(), z.string()]),
    rejectedQuantity:  z.union([z.number().positive(), z.string()]).optional(),
    warehouseAccepted:z.number().optional(),
    rejecetedWarehouse:z.number().optional()
})

export const lineItemSchema = z.object({
    item_price: itemPriceDtoSchema,
    quantity: z.number().or(z.string()).optional(),
    lineType:z.number(),
    itemLineReference:z.number().optional(),
    //FOR RECEIPT
    lineItemReceipt:lineItemReceipt,
    amount:z.number().optional(),
  })
  .superRefine((data,ctx)=>{
    if (data.lineType == ItemLineType.ITEM_LINE_ORDER && data.quantity == undefined) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params:{
                i18n:{key:"custom.required"}
            },
            path:["quantity"]
          });
      }
}
)
