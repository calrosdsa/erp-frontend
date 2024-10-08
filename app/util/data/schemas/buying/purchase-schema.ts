import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { supplierDtoSchema } from "./supplier-schema";
import { components } from "~/sdk";
import { currencySchema } from "../app/currency-schema";
import { lineItemSchema } from "../stock/item-line-schema";

export const createPurchaseSchema = z.object({
  supplier: supplierDtoSchema,
  supplierName: z.string(),
  // name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
  delivery_date: z.date().optional(),
  date: z.date(),
  currencyName: z.string(),
  currency: currencySchema,
  lines: z.array(lineItemSchema),
});

export const orderLineSchemaToOrderLineDto = (
  d: z.infer<typeof lineItemSchema>
): components["schemas"]["LineItemDto"] => {
  return {
    amount: 0,
    quantity: Number(d.quantity),
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
