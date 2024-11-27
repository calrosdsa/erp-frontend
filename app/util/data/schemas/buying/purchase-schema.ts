import { z } from "zod";
import { components } from "~/sdk";
import { lineItemSchema } from "../stock/line-item-schema";
import { ItemLineType } from "~/gen/common";

export const createPurchaseSchema = z.object({
  partyType:z.string(),
  partyUuid:z.string(),
  partyName:z.string(),
  // name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
  // priceListID:z.number(),
  // priceListName:z.string(),

  delivery_date: z.date().optional(),
  date: z.date(),
  currencyName: z.string(),
  currency: z.string(),
  lines: z.array(lineItemSchema),
});


export const lineItemSchemaToLineData = (
  d: z.infer<typeof lineItemSchema>
): components["schemas"]["LineItemData"] => {
  const line:components["schemas"]["LineItemData"]  = {
    rate: d.rate,
    quantity: Number(d.quantity),
    item_price_id: Number(d.item_price_id),
    item_price_uuid:"",
    item_line_reference:d.itemLineReference,
  }
  if(d.deliveryLineItem?.sourceWarehouse){
    line.delivery_line_item = {
      source_warehouse:d.deliveryLineItem.sourceWarehouse,
    }
  }
  if(d.lineItemReceipt){
    line.line_receipt = {
      accepted_quantity:Number(d.lineItemReceipt?.acceptedQuantity),
      rejected_quantity:Number(d.lineItemReceipt?.rejectedQuantity),
      accepted_warehouse:d.lineItemReceipt?.acceptedWarehouse,
      rejected_warehouse:d.lineItemReceipt?.rejectedWarehouse,
    }
  }
  if(d.lineItemStockEntry) {
    line.line_stock_entry = {
      source_warehouse:d.lineItemStockEntry?.sourceWarehouse,
      target_warehouse:d.lineItemStockEntry?.targetWarehouse,
    }
  }

  return line;
};






// export const itemPriceSchemaToItemPriceDto = (
//   d: z.infer<typeof itemPriceDtoSchema>
// ): components["schemas"]["ItemPriceDto"] => {
//   return {
//     code: d.code,
//     uuid: d.uuid,
//     rate: d.rate,
//     created_at:"",
//     item_quantity: d.item_quantity,
//     item_name: d.item_name,
//     item_code: d.item_code,
//     uom: d.uom,
//     item_uuid: d.item_uuid,
//   };
// };
