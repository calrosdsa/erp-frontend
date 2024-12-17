import { z } from "zod";
import { uomSchema } from "../setting/uom-schema";
import { groupSchema } from "../group-schema";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { components } from "~/sdk";
import { itemInventory } from "./item-inventory-schema";

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


export const mapToItemPriceLine = (d:z.infer<typeof itemPriceLine>)=>{
  const itemPrice:components["schemas"]["ItemPriceLine"] ={
    item_quantity: d.itemQuantity,
    price_list_id: d.priceListID,
    rate: d.rate,
    uom_id: d.uomID
  }
  return itemPrice
}