import { z } from "zod";
import { uomSchema } from "../setting/uom-schema";
import { groupSchema } from "../group-schema";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { components } from "~/sdk";
import { itemInventory } from "./item-inventory-schema";
import { field, fieldNull } from "..";
import { itemPriceSchema, mapToItemPriceData } from "./item-price-schema";

export type ItemSchema = z.infer<typeof itemSchema>

export const itemSchema = z.object({
  id:z.number().optional(),
  name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
  pn:z.string().optional().nullable(),
  group:fieldNull,
  uom:field,
  maintainStock:z.boolean(),
  description:z.string().optional().nullable(),
  //Inventary settings
  shelfLifeInDays:z.coerce.number().optional().nullable(),
  warrantyPeriodInDays:z.coerce.number().optional().nullable(),
  hasSerialNo:z.coerce.boolean().optional().nullable(),
  serialNoTemplate:z.coerce.string().optional().nullable(),
  weightUom:fieldNull,
  weightPerUnit:z.coerce.number().optional().nullable(),

  itemPrices:z.array(itemPriceSchema),
})




export const mapToItemData = (e:ItemSchema)=>{
  const d:components["schemas"]["ItemData"] = {
    fields: {
      description: e.description,
      group_id: e.group?.id,
      maintain_stock: e.maintainStock,
      name:e.name,
      pn: e.pn,
      unit_of_measure_id: e.uom.id || 0,
    },
    id: e.id || 0,  
    item_inventory: {
      has_serial_no: e.hasSerialNo,
      item_id: e.id,
      serial_no_template: e.serialNoTemplate,
      shelf_life_in_days: e.shelfLifeInDays,
      warranty_period_in_days: e.warrantyPeriodInDays,
      weight_uom_id: e.weightUom?.id,
      weight_per_unit: e.weightPerUnit,
    },
    item_price_lines: e.itemPrices.map(t=>mapToItemPriceData(t)),
  } 
  return d 
}

export const itemPriceLine = z.object({
  rate:z.coerce.number(),
  itemQuantity:z.coerce.number(),
  priceList:z.string().min(1),
  priceListID:z.number(),
  uom:z.string(),
  uomID:z.number(),
})
export const createItemSchema = z.object({
  name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),  
  code:z.string().min(DEFAULT_MIN_LENGTH),
  uomName: z.string(),
  groupName:z.string(),
  groupID:z.number(),
  uomID:z.number(),
  itemPriceLines:z.array(itemPriceLine),
  description:z.string().optional(),
  maintainStock:z.boolean(),

  itemInventory:itemInventory.optional(),
});


export const editItemSchema = z.object({
  id:z.number(),
  name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
  code:z.string().min(DEFAULT_MIN_LENGTH),
  uomName: z.string(),
  groupName:z.string(),
  groupID:z.number(),
  uomID:z.number(),
  description:z.string().optional().nullable(),
  maintainStock:z.boolean(),
});


// export const mapToItemPriceLine = (d:z.infer<typeof itemPriceLine>)=>{
//   const itemPrice:components["schemas"]["ItemPriceLine"] ={
//     item_quantity: d.itemQuantity,
//     price_list_id: d.priceListID,
//     rate: d.rate,
//     uom_id: d.uomID,
//     action: "",
//   }
//   return itemPrice
// }