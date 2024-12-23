import { z } from "zod";
import { components } from "~/sdk";
import { formatAmount } from "~/util/format/formatCurrency";

export const pricingChargeDataSchema = z.object({
  name: z.string(),
  rate: z.coerce.number(),
});

export const pricingLineItemDataSchema = z.object({
  description: z.string().optional(),
  part_number: z.string().optional(),
  pl_unit: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  supplier_id: z.number().optional(),
  supplier: z.string().optional(),

  // pl_unit_fn:z.coerce.string().optional(),
  // quantity_fn:z.coerce.string().optional(),
  fob_unit_fn: z.coerce.string().optional(),
  retention_fn: z.coerce.string().optional(),
  cost_zf_fn: z.coerce.string().optional(),
  cost_alm_fn: z.coerce.string().optional(),
  tva_fn: z.coerce.string().optional(),
  cantidad_fn: z.coerce.string().optional(),
  precio_unitario_fn: z.coerce.string().optional(),
  precio_total_fn: z.coerce.string().optional(),

  precio_unitario_tc_fn: z.coerce.string().optional(),
  precio_total_tc_fn: z.coerce.string().optional(),
  fob_total_fn: z.coerce.string().optional(),
  gpl_total_fn: z.coerce.string().optional(),
  tva_total_fn: z.coerce.string().optional(),

  fob_unit: z.coerce.number().optional(),
  retention: z.coerce.number().optional(),
  cost_zf: z.coerce.number().optional(),
  cost_alm: z.coerce.number().optional(),
  tva: z.coerce.number().optional(),
  cantidad: z.coerce.number().optional(),
  precio_unitario: z.coerce.number().optional(),
  precio_total: z.coerce.number().optional(),

  precio_unitario_tc: z.coerce.number().optional(),
  precio_total_tc: z.coerce.number().optional(),
  fob_total: z.coerce.number().optional(),
  gpl_total: z.coerce.number().optional(),
  tva_total: z.coerce.number().optional(),
});

export const columnConfig = z.object({});

export const pricingDataSchema = z.object({
  id:z.number().optional(),
  pricing_line_items: z.array(pricingLineItemDataSchema),
  pricing_charges: z.array(pricingChargeDataSchema),
});

export const editPricingSchema = z.object({
  // id: z.number(),
  id:z.number().optional(),
  pricing_line_items: z.array(pricingLineItemDataSchema),
  pricing_charges: z.array(pricingChargeDataSchema),
});

export const mapPricingChargeData = (
  input: z.infer<typeof pricingChargeDataSchema>
): components["schemas"]["PricingChargeData"] => {
  return {
    name: input.name,
    rate: input.rate,
  };
};

export const mapPricingChargeDto= (
  input:components["schemas"]["PricingChargeDto"]
): z.infer<typeof pricingChargeDataSchema> => {
  return {
    name: input.name,
    rate: formatAmount(input.rate),
  };
};

export const mapPricingLineItemData = (
  input: z.infer<typeof pricingLineItemDataSchema>
): components["schemas"]["PricingLineItemData"] => {
  const l: components["schemas"]["PricingLineItemData"] = {
    description: input.description,
    part_number: input.part_number,
    pl_unit: input.pl_unit,
    quantity: input.quantity,
    supplier_id: input.supplier_id,

    fob_unit_fn: input.fob_unit_fn,
    retention_fn: input.retention_fn,
    cost_zf_fn: input.cost_zf_fn,
    cost_alm_fn: input.cost_alm_fn,
    tva_fn: input.tva_fn,
    cantidad_fn: input.cantidad_fn,
    precio_unitario_fn: input.precio_unitario_fn,
    precio_total_fn: input.precio_total_fn,
    precio_unitario_tc_fn: input.precio_unitario_tc_fn,
    precio_total_tc_fn: input.precio_total_tc_fn,
    fob_total_fn: input.fob_total_fn,
    gpl_total_fn: input.gpl_total_fn,
    tva_total_fn: input.tva_total_fn,
  };
  return l;
};

export const mapPricingLineItemDto = (
  input: components["schemas"]["PricingLineItemDto"]
): z.infer<typeof pricingLineItemDataSchema> => {
  const l: z.infer<typeof pricingLineItemDataSchema> = {
    description: input.description,
    part_number: input.part_number,
    pl_unit: input.pl_unit,
    quantity: input.quantity,
    supplier_id: input.supplier_id,
    supplier:input.supplier,

    fob_unit_fn: input.fob_unit_fn,
    retention_fn: input.retention_fn,
    cost_zf_fn: input.cost_zf_fn,
    cost_alm_fn: input.cost_alm_fn,
    tva_fn: input.tva_fn,
    cantidad_fn: input.cantidad_fn,
    precio_unitario_fn: input.precio_unitario_fn,
    precio_total_fn: input.precio_total_fn,
    precio_unitario_tc_fn: input.precio_unitario_tc_fn,
    precio_total_tc_fn: input.precio_total_tc_fn,
    fob_total_fn: input.fob_total_fn,
    gpl_total_fn: input.gpl_total_fn,
    tva_total_fn: input.tva_total_fn,
  };
  return l;
};
