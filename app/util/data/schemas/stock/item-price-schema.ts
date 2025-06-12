import { z } from "zod";
import { field } from "..";
import { components } from "~/sdk";

export type ItemPriceSchema = z.infer<typeof itemPriceSchema>;
export type ItemPriceLineSchema = z.infer<typeof itemPriceLineSchema>;

export const itemPriceLineSchema = z.object({
  id: z.number().optional(),
  item_name: z.string(),
  item_id: z.number(),
  price_list_name: z.string(),
  price_list_id: z.number(),
  uom_id: z.number(),
  uom_name: z.string(),
  rate: z.coerce.number(),
  item_quantity: z.coerce.number(),
  action: z.string().optional(),
});

export const itemPriceSchema = z.object({
  id: z.number().optional(),
  item: field,
  price_list: field,
  item_quantity: z.coerce.number(),
  rate: z.coerce.number(),
  uom: field,
  action: z.string(),
});

export const mapLineToItemPriceData = (e: ItemPriceLineSchema) => {
  const d: components["schemas"]["ItemPriceData"] = {
    id: e.id,
    fields: {
      item_id: e.item_id || 0,
      price_list_id: e.price_list_id || 0,
      rate: e.rate,
      item_quantity: e.item_quantity,
      unit_of_measure_id: e.uom_id || 0,
    },
    action: e.action,
  };
  return d;
};

export const mapToItemPriceData = (e: ItemPriceSchema) => {
  const d: components["schemas"]["ItemPriceData"] = {
    id: e.id,
    fields: {
      item_id: e.item.id || 0,
      price_list_id: e.price_list.id || 0,
      rate: e.rate,
      item_quantity: e.item_quantity,
      unit_of_measure_id: e.uom.id || 0,
    },
    action: e.action,
  };
  return d;
};

export const mapDtoToItemPriceLine = (e:components["schemas"]["ItemPriceDto"])=>{
  const d:ItemPriceLineSchema = {
    id: e.id,
    item_quantity: e.item_quantity,
    rate: e.rate,
    item_name: e.item_name,
    item_id: e.item_id,
    price_list_name: e.price_list_name,
    price_list_id: e.price_list_id,
    uom_id: e.item_price_uom_id,
    uom_name: e.item_price_uom,
    
  }
  return d
}

export const createItemPriceSchema = z.object({
  rate: z.coerce.number(),
  itemQuantity: z.coerce.number(),

  item: z.string(),
  itemID: z.number(),

  priceList: z.string(),
  priceListID: z.number(),

  uom: z.string(),
  uomID: z.number(),
});

export const editItemPriceSchema = z.object({
  id: z.number(),
  rate: z.coerce.number(),
  itemQuantity: z.coerce.number(),

  item: z.string(),
  itemID: z.number(),

  priceList: z.string(),
  priceListID: z.number(),

  uom: z.string(),
  uomID: z.number(),
});
