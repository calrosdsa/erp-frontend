import { z } from "zod";
import { components } from "~/sdk";
import { lineItemSchema } from "../stock/line-item-schema";
import { ItemLineType } from "~/gen/common";
import {
  mapToTaxAndChargeData,
  taxAndChargeSchema,
} from "../accounting/tax-and-charge-schema";
import { field, fieldNull } from "..";
import { formatRFC3339 } from "date-fns";

export const orderDataSchema = z.object({
  id:z.number().optional(),
  party: field.optional(),
  postingDate: z.date(),
  postingTime: z.string(),
  tz: z.string(),
  deliveryDate: z.date().optional(),
  currency: z.string(),

  project: fieldNull,
  costCenter: fieldNull,
  priceList: fieldNull,

  lines: z.array(lineItemSchema),
  taxLines: z.array(taxAndChargeSchema),
}).superRefine((data, ctx) => {
  if (data.party?.id == undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      params: {
        i18n: { key: "custom.required" },
      },
      path: ["party"],
    });
  }
});

export const editOrderSchema = z.object({
  id: z.number(),
  partyName: z.string(),
  partyID: z.number(),

  postingDate: z.date(),
  postingTime: z.string(),
  tz: z.string(),
  deliveryDate: z.date().optional(),
  currency: z.string(),

  projectName: z.string().optional(),
  projectID: z.number().optional(),

  costCenterName: z.string().optional(),
  costCenterID: z.number().optional(),
});

export const lineItemSchemaToLineData = (
  d: z.infer<typeof lineItemSchema>
): components["schemas"]["LineItemData"] => {
  const line: components["schemas"]["LineItemData"] = {
    rate: d.rate,
    quantity: Number(d.quantity),
    item_price_id: Number(d.item_price_id),
    line_type: d.lineType,
    item_line_reference: d.itemLineReference,
  };
  if (d.deliveryLineItem?.sourceWarehouseID) {
    line.delivery_line_item = {
      source_warehouse: d.deliveryLineItem.sourceWarehouseID,
    };
  }
  if (d.lineItemReceipt) {
    line.line_receipt = {
      accepted_quantity: Number(d.lineItemReceipt?.acceptedQuantity),
      rejected_quantity: Number(d.lineItemReceipt?.rejectedQuantity),
      accepted_warehouse: d.lineItemReceipt?.acceptedWarehouseID,
      rejected_warehouse: d.lineItemReceipt?.rejectedWarehouseID,
    };
  }
  if (d.lineItemStockEntry) {
    line.line_stock_entry = {
      source_warehouse: d.lineItemStockEntry?.sourceWarehouse,
      target_warehouse: d.lineItemStockEntry?.targetWarehouse,
    };
  }

  return line;
};

export const mapToOrderData = (
  e: z.infer<typeof orderDataSchema>,
  orderPartyType: string
): components["schemas"]["OrderBody"] => {
  const d: components["schemas"]["OrderData"] = {
    id:e.id,
    fields: {
      cost_center_id: e.costCenter?.id,
      currency: e.currency,
      delivery_date: e.deliveryDate ? formatRFC3339(e.deliveryDate) : undefined,
      party_id: e.party?.id || 0,
      posting_date: formatRFC3339(e.postingDate),
      posting_time: e.postingTime,
      price_list_id: e.priceList?.id,
      project_id: e.project?.id,
      tz: e.tz,
    },
    order_party_type: orderPartyType,
    total_amount:
      e.lines.reduce(
        (prev, curr) => prev + Number(curr.quantity) * curr.rate,
        0
      ) + e.taxLines.reduce((prev, curr) => prev + Number(curr.amount), 0),
  };
  const lines = e.lines.map((t) => lineItemSchemaToLineData(t));
  const taxLines = e.taxLines.map((t) => mapToTaxAndChargeData(t));
  return {
    order: d,
    items: {
      lines: lines,
    },
    tax_and_charges: {
      lines: taxLines,
    },
  };
};
