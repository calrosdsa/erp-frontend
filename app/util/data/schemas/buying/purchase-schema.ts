import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { supplierDtoSchema } from "./supplier-schema";
import { components } from "~/sdk";
import { currencySchema } from "../app/currency-schema";

export const itemPriceDtoSchema = z.object({
  code: z.string().optional(),
  uuid: z.string().optional(),
  rate: z.number(),
  item_quantity: z.number().optional(),
  item_name: z.string(),
  item_code: z.string(),
  item_uuid: z.string(),
  uom: z.string(),
  tax_name:z.string().optional(),
  tax_uuid:z.string().optional(),
  tax_value:z.number(),
});

export const orderLineSchema = z.object({
  item_price: itemPriceDtoSchema,
  quantity: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number()),
  amount: z.number().optional(),
});

export const createPurchaseSchema = z.object({
  supplier: supplierDtoSchema,
  supplierName: z.string(),
  // name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
  delivery_date: z.date().optional(),
  date: z.date(),
  currencyName: z.string(),
  currency: currencySchema,
  lines: z.array(orderLineSchema),
});

export const orderLineSchemaToOrderLineDto = (
  d: z.infer<typeof orderLineSchema>
): components["schemas"]["OrderLine"] => {
  return {
    amount: d.amount || 0,
    quantity: d.quantity,
    item_price_uuid: d.item_price.uuid || "",
  };
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
