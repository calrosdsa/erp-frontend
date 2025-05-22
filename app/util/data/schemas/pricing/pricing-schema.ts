import { z } from "zod";
import { components } from "~/sdk";
import { isZeroValue } from "~/util";
import { formatAmount } from "~/util/format/formatCurrency";
import { field, fieldNull } from "..";

export type PricingSchema = z.infer<typeof pricingDataSchema>;
export type PricingLineItemSchema = z.infer<typeof pricingLineItemDataSchema>;

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

  is_title: z.boolean().optional(),
  color: z.string().optional(),
});

export const columnConfig = z.object({});

export const pricingDataSchema = z.object({
  id: z.number().optional(),
  customer: fieldNull.optional().nullable(),
  pricing_line_items: z.array(pricingLineItemDataSchema),
  pricing_charges: z.array(pricingChargeDataSchema),

  project: fieldNull.optional().nullable(),
  costCenter: fieldNull.optional().nullable(),
});

export const mapLineItemToPricingItem = (
  lineItem: components["schemas"]["LineItemDto"]
) => {
  const d:PricingLineItemSchema = {
    description:lineItem,
    quantity:lineItem.quantity,
    part_number:lineItem.item_code,
    pl_unit:lineItem.rate,
  }
  return d
};

export const mapPricingChargeData = (
  input: z.infer<typeof pricingChargeDataSchema>
): components["schemas"]["PricingChargeData"] => {
  return {
    name: input.name,
    rate: input.rate,
  };
};

export const mapPricingChargeDto = (
  input: components["schemas"]["PricingChargeDto"]
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
    supplier_id: isZeroValue(input.supplier_id),
    description: isZeroValue(input.description),
    part_number: isZeroValue(input.part_number),
    pl_unit: isZeroValue(input.pl_unit),
    quantity: isZeroValue(input.quantity),
    fob_unit: isZeroValue(input.fob_unit),
    retention: isZeroValue(input.retention),
    cost_zf: isZeroValue(input.cost_zf),
    cost_alm: isZeroValue(input.cost_alm),
    tva: isZeroValue(input.tva),
    cantidad: isZeroValue(input.cantidad),
    precio_unitario: isZeroValue(input.precio_unitario),
    precio_total: isZeroValue(input.precio_total),
    precio_unitario_tc: isZeroValue(input.precio_unitario_tc),
    precio_total_tc: isZeroValue(input.precio_total_tc),
    fob_total: isZeroValue(input.fob_total),
    gpl_total: isZeroValue(input.gpl_total),
    tva_total: isZeroValue(input.tva_total),

    fob_unit_fn: isZeroValue(input.fob_unit_fn),
    retention_fn: isZeroValue(input.retention_fn),
    cost_zf_fn: isZeroValue(input.cost_zf_fn),
    cost_alm_fn: isZeroValue(input.cost_alm_fn),
    tva_fn: isZeroValue(input.tva_fn),
    cantidad_fn: isZeroValue(input.cantidad_fn),
    precio_unitario_fn: isZeroValue(input.precio_unitario_fn),
    precio_total_fn: isZeroValue(input.precio_total_fn),
    precio_unitario_tc_fn: isZeroValue(input.precio_unitario_tc_fn),
    precio_total_tc_fn: isZeroValue(input.precio_total_tc_fn),
    fob_total_fn: isZeroValue(input.fob_total_fn),
    gpl_total_fn: isZeroValue(input.gpl_total_fn),
    tva_total_fn: isZeroValue(input.tva_total_fn),
    is_title: isZeroValue(input.is_title),
    color: isZeroValue(input.color),
  };

  return l;
};

export const mapPricingLineItemDto = (
  input: components["schemas"]["PricingLineItemDto"]
): z.infer<typeof pricingLineItemDataSchema> => {
  const l: z.infer<typeof pricingLineItemDataSchema> = {
    description: input.description,
    part_number: input.part_number,
    pl_unit: formatAmount(input.pl_unit),
    quantity: input.quantity,
    supplier_id: input.supplier_id,
    supplier: input.supplier,

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
    is_title: input.is_title,
    color: input.color,
  };
  return l;
};

export const mapToPricingData = (
  e: z.infer<typeof pricingDataSchema>
): components["schemas"]["PricingData"] => {
  const pricingLineItems = e.pricing_line_items.map((t) =>
    mapPricingLineItemData(t)
  );
  const pricingCharges = e.pricing_charges.map((t) => mapPricingChargeData(t));
  const d: components["schemas"]["PricingData"] = {
    id: e.id,
    fields: {
      cost_center_id: e.costCenter?.id,
      customer_id: e.customer?.id || null,
      project_id: e.project?.id,
    },
    pricing_charges: pricingCharges,
    pricing_line_items: pricingLineItems,
  };
  return d;
};
