import { z } from "zod";
import { DEFAULT_MIN_LENGTH } from "~/constant";
import { ItemLineType, itemLineTypeFromJSON } from "~/gen/common";
import { validateNumber, validateStringNumber } from "../base/base-schema";
import { components } from "~/sdk";


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
    acceptedQuantity:  z.coerce.number().gt(0),
    rejectedQuantity:  z.coerce.number(),
    acceptedWarehouse:z.string().optional(),
    rejectedWarehouse:z.string().optional()
})
// transform: (arg: string, ctx: z.RefinementCtx) => number | Promise<number>): z.ZodEffects<z.ZodString, number, string>

export const lineItemSchema = z.object({
    item_price: itemPriceDtoSchema,
    // quantity: z.string().transform(validateStringNumber).optional(),
    quantity:z.coerce.number().gt(0),
    lineType:z.number(),
    itemLineReference:z.number().optional(),
    //FOR RECEIPT
    lineItemReceipt:lineItemReceipt.optional(),
    amount:z.number().optional(),
  })
  .superRefine((data,ctx)=>{
    switch(data.lineType){
      case ItemLineType.ITEM_LINE_ORDER:{
        if (data.quantity == undefined && data.quantity == "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                params:{
                    i18n:{key:"custom.required"}
                },
                path:["quantity"]
              });
          }else {
            data.amount = Number(data.quantity) * data.item_price.rate
          }
        break;
      }
      case ItemLineType.ITEM_LINE_RECEIPT:{
        if(data.lineItemReceipt != undefined) {
          data.quantity = data.lineItemReceipt.acceptedQuantity+data.lineItemReceipt.rejectedQuantity
          data.amount = data.quantity * data.item_price.rate
        }
        break;
      }
    }
}
)


export const mapToLineItem = (line:components["schemas"]["ItemLineDto"],to:ItemLineType):z.infer<typeof lineItemSchema>=>{
  const lineItem:z.infer<typeof lineItemSchema> = {
    amount:line.quantity * line.rate,
    lineType:to,
    quantity:line.quantity,
    itemLineReference:line.id,
    item_price:{
      uuid:line.item_price_uuid,
      rate:line.item_price_rate,
      tax_value:line.tax_value,
      item_code:line.item_code,
      item_name:line.item_name,
      item_uuid:line.item_uuid,
      uom:line.uom,    
    }
  }
  if(to == ItemLineType.ITEM_LINE_RECEIPT){
    lineItem.lineItemReceipt = {
      acceptedQuantity:line.quantity,
      rejectedQuantity:0,
    }
  }
  return lineItem
}