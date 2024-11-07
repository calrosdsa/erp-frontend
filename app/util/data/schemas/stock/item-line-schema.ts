import { z } from "zod";
import { DEFAULT_MIN_LENGTH } from "~/constant";
import { ItemLineType, itemLineTypeFromJSON, itemLineTypeToJSON } from "~/gen/common";
import { validateNumber, validateStringNumber } from "../base/base-schema";
import { components } from "~/sdk";
import { formatAmountToInt } from "~/util/format/formatCurrency";


export const itemPriceDtoSchema = z.object({
    code: z.string().optional(),
    uuid: z.string(),
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


export const itemLineDtoSchema = z.object({
  id:z.number(),
  rate:z.number(),
  quantity:z.number(),
  line_type:z.string(),
  //ITEM
  item_name:z.string(),
  item_code:z.string(),
  item_uuid:z.string(),
  //UOM 
  uom:z.string()
})

  

export const lineItemReceipt = z.object({
    acceptedQuantity:  z.coerce.number().gt(0),
    rejectedQuantity:  z.coerce.number(),
    acceptedWarehouse:z.number(),
    acceptedWarehouseName:z.string(),
    rejectedWarehouse:z.number().optional(),
    rejectedWarehouseName:z.string().optional(),
})
// transform: (arg: string, ctx: z.RefinementCtx) => number | Promise<number>): z.ZodEffects<z.ZodString, number, string>

export const lineItemSchema = z.object({
    item_price: itemPriceDtoSchema,
    // quantity: z.string().transform(validateStringNumber).optional(),
    quantity:z.coerce.number().gt(0),
    rate:z.coerce.number().gt(0),
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


export const mapToLineItem = (line:components["schemas"]["ItemLineDto"],to:ItemLineType):z.infer<typeof editLineItemSchema>=>{
  const lineItem:z.infer<typeof editLineItemSchema> = {
    amount: line.quantity * line.rate,
    lineType: to,
    rate: line.rate,
    quantity: line.quantity,
    itemLineReference: line.id,

    item_price_uuid: line.item_price_uuid,
    item_price_rate: line.rate,

    item_name: line.item_name,
    item_code: line.item_code,
    uom: line.uom,
    item_uuid: line.item_uuid
  }
  if(to == ItemLineType.ITEM_LINE_RECEIPT){
    lineItem.lineItemReceipt = {
      acceptedQuantity:line.quantity,
      rejectedQuantity:0,
      acceptedWarehouse:0,
      acceptedWarehouseName:"",
    }
  }
  return lineItem
}

export const mapToItemLineDto = (line:z.infer<typeof editLineItemSchema>):components["schemas"]["ItemLineDto"]=>{
  const itemLineDto:components["schemas"]["ItemLineDto"] = {
    id: 0,
    item_code: line.item_code,
    item_name: line.item_name,
    item_price_uuid: line.item_price_uuid,
    item_uuid: line.item_uuid,
    line_type: itemLineTypeToJSON(Number(line.lineType)),
    quantity: Number(line.quantity),
    rate: line.rate,
    uom: line.uom,
  }
  // if(to == ItemLineType.ITEM_LINE_RECEIPT){
    // itemLineDto.lineItemReceipt = {
      // acceptedQuantity:line.quantity,
      // rejectedQuantity:0,
    // }
  // }
  return itemLineDto
}




export const editLineItemSchema = z.object({
  itemLineID:z.number().optional(),
  quantity:z.coerce.number().optional(),
  rate:z.coerce.number(),

  lineType:z.number().optional(),
  itemLineReference:z.number().optional(),
  lineItemReceipt:lineItemReceipt.optional(),
  amount:z.number().optional(),

  uom:z.string(),

  item_name:z.string(),
  item_uuid:z.string(),
  item_code:z.string(),

  item_price_uuid:z.string(),
  item_price_rate:z.number().optional(),

  party_type:z.string().optional(),
})
.superRefine((data,ctx)=>{
  switch(data.lineType){
    case ItemLineType.ITEM_LINE_INVOICE:
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
          data.amount = Number(data.quantity) * data.rate
        }
      break;
    }
    case ItemLineType.ITEM_LINE_RECEIPT:{
      if(data.lineItemReceipt != undefined) {
        data.quantity = data.lineItemReceipt.acceptedQuantity+data.lineItemReceipt.rejectedQuantity
      }
      break;
    }
  }
}
)
