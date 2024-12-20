import { z } from "zod";
import { components } from "~/sdk";

export const pricingChargeDataSchema = z.object({
  name: z.string(),
  rate: z.coerce.number(),
  type: z.string(),
  orderID:z.number()
});

export const pricingLineItemDataSchema = z.object({
  description: z.string().nullable().optional(),
  fob_id: z.number().nullable().optional(),
  freight_id: z.number().nullable().optional(),
  importation_id: z.number().nullable().optional(),
  margin_id: z.number().nullable().optional(),
  part_number: z.string().nullable().optional(),
  pl_unit: z.coerce.number().nullable().optional(),
  quantity: z.coerce.number().nullable().optional(),
  retention_id: z.number().nullable().optional(),
  taxes_id: z.number().nullable().optional(),
  tc_id: z.number().nullable().optional(),
  tva_id: z.number().nullable().optional(),
  supplier_id: z.number().nullable().optional(),
  supplier_name: z.string().optional(),

  fob_unit:z.coerce.number().optional(),
  retention:z.coerce.number().optional(),
  cost_zf:z.coerce.number().optional(),
  cost_alm:z.coerce.number().optional(),
  tva:z.coerce.number().optional(),
  cantidad:z.coerce.number().nullable().optional(),
  precio_unitario:z.coerce.number().optional(),
  precio_total:z.coerce.number().optional(),
  
  precio_unitario_tc:z.coerce.number().optional(),
  precio_total_tc:z.coerce.number().optional(),
  fob_total:z.coerce.number().optional(),
  gpl_total:z.coerce.number().optional(),
  tva_total:z.coerce.number().optional(),

});

export const columnConfig = z.object({

})

export const pricingDataSchema = z.object({
  pricing_line_items: z.array(pricingLineItemDataSchema),
  pricing_charges: z.array(pricingChargeDataSchema),
});



export const mapPricingChargeData = (
  input: z.infer<typeof pricingChargeDataSchema>
): components["schemas"]["PricingChargeData"] => {
  return {
    type: input.type,
    name: input.name,
    rate: input.rate,
  };
};

export const mapPricingLineItemData = (
  input: z.infer<typeof pricingLineItemDataSchema>
): components["schemas"]["PricingLineItemData"] => {
  return {
    description: input.description ?? null,
    fob_id: input.fob_id ?? null,
    freight_id: input.freight_id ?? null,
    importation_id: input.importation_id ?? null,
    margin_id: input.margin_id ?? null,
    part_number: input.part_number ?? null,
    pl_unit: input.pl_unit ?? null,
    quantity: input.quantity ?? null,
    retention_id: input.retention_id ?? null,
    supplier_id: input.supplier_id ?? null,
    taxes_id: input.taxes_id ?? null,
    tc_id: input.tc_id ?? null,
    tva_id: input.tva_id ?? null,
  };
};
