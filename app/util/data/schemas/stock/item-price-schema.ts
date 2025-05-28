import { z } from "zod";
import { field } from "..";
import { components } from "~/sdk";

export type ItemPriceSchema = z.infer<typeof itemPriceSchema>;

export const itemPriceSchema = z.object({
  id: z.number().optional(),
  item: field,
  price_list: field,
  item_quantity: z.coerce.number(),
  rate: z.coerce.number(),
  uom: field,
  action: z.string(),
});

export const mapToItemPriceData = (e: ItemPriceSchema) => {
  const d: components["schemas"]["ItemPriceData"] = {
    id: e.id,
    fields: {
      item_id: e.item.id || 0,
      price_list_id:e.price_list.id || 0,
      rate:e.rate,
      item_quantity:e.item_quantity,
      unit_of_measure_id:e.uom.id || 0,
    },
    action:e.action,
  };
  return d;
};

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
