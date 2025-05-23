import { z } from "zod";
import { DEFAULT_MIN_LENGTH } from "~/constant";
import {
  ItemLineType,
  itemLineTypeFromJSON,
  itemLineTypeToJSON,
  PartyType,
  partyTypeFromJSON,
} from "~/gen/common";
import { validateNumber, validateStringNumber } from "../base/base-schema";
import { components } from "~/sdk";
import { formatAmount, formatAmountToInt } from "~/util/format/formatCurrency";

export type LineItemType = z.infer<typeof lineItemSchema>;

export const lineItemDefault = (opts: {
  lineType: string;
  updateStock?: boolean;
}): LineItemType => {
  const line: LineItemType = {
    rate: 0,
    lineType: opts.lineType,
    uom: "",
    item_name: "",
    item_code: "",
    itemID: 0,
    unitOfMeasureID: 0,
  };
  const lineType = itemLineTypeFromJSON(opts.lineType);
  if (lineType == ItemLineType.ITEM_LINE_RECEIPT || opts.updateStock) {
    line.lineItemReceipt = {
      acceptedQuantity: 0,
      rejectedQuantity: 0,
    };
  }
  return line;
};

export const toLineItemSchema = (
  line: components["schemas"]["LineItemDto"],
  opts?: {
    partyType?: string;
    updateStock?: boolean;
  }
): LineItemType => {
  const lineItem: LineItemType = {
    itemLineID: line.id,
    amount: formatAmount(line.quantity * line.rate),
    lineType: line.line_type,
    rate: formatAmount(line.rate),
    quantity: line.quantity,
    itemLineReferenceID: line.item_line_reference_id,
    itemID: line.item_id,
    unitOfMeasureID: line.unit_of_measure_id,

    item_name: line.item_name,
    item_code: line.item_code,
    uom: line.uom,
    party_type: opts?.partyType,
  };
  const lineType = itemLineTypeFromJSON(line.line_type);
  const partyType = partyTypeFromJSON(opts?.partyType);

  if (
    lineType == ItemLineType.ITEM_LINE_RECEIPT ||
    (opts?.updateStock && partyType == PartyType.purchaseInvoice)
  ) {
    lineItem.lineItemReceipt = {
      acceptedQuantity: line.accepted_quantity,
      rejectedQuantity: line.rejected_quantity,
      acceptedWarehouseID: line.accepted_warehouse_id,
      acceptedWarehouse: line.accepted_warehouse,
      rejectedWarehouse: line.rejected_warehouse,
      rejectedWarehouseID: line.rejected_warehouse_id,
    };
  }
  if (
    lineType == ItemLineType.DELIVERY_LINE_ITEM ||
    (opts?.updateStock && partyType == PartyType.saleInvoice)
  ) {
    lineItem.deliveryLineItem = {
      sourceWarehouseID: line.source_warehouse_id,
      sourceWarehouse: line.source_warehouse,
    };
  }
  return lineItem;
};

export const schemaToLineItemData = (
  line: LineItemType,
  opts?: {
    updateStock?: boolean;
  }
): components["schemas"]["LineItemData"] => {
  const lineItemData: components["schemas"]["LineItemData"] = {
    item_id: line.itemID,
    unit_of_measure_id: line.unitOfMeasureID,
    line_type: line.lineType,
    quantity: line.quantity || 0,
    rate: line.rate,
  };
  const lineType = itemLineTypeFromJSON(line.lineType);
  if (lineType == ItemLineType.ITEM_LINE_RECEIPT || opts?.updateStock) {
    lineItemData.line_receipt = {
      accepted_warehouse: line.lineItemReceipt?.acceptedWarehouseID,
      rejected_warehouse: line.lineItemReceipt?.rejectedWarehouseID,
      accepted_quantity: line.lineItemReceipt?.acceptedQuantity || 0,
      rejected_quantity: line.lineItemReceipt?.rejectedQuantity || 0,
    };
  }
  if (lineType == ItemLineType.ITEM_LINE_STOCK_ENTRY) {
    lineItemData.line_stock_entry = {
      source_warehouse: line.lineItemStockEntry?.sourceWarehouse,
      target_warehouse: line.lineItemStockEntry?.targetWarehouse,
    };
  }
  if (lineType == ItemLineType.DELIVERY_LINE_ITEM || opts?.updateStock) {
    lineItemData.delivery_line_item = {
      source_warehouse: line.lineItemStockEntry?.sourceWarehouse || 0,
    };
  }
  return lineItemData;
};

export const lineItemReceipt = z.object({
  acceptedQuantity: z.coerce.number().gt(0),
  rejectedQuantity: z.coerce.number(),
  acceptedWarehouseID: z.number().optional(),
  acceptedWarehouse: z.string().optional(),
  rejectedWarehouseID: z.number().optional(),
  rejectedWarehouse: z.string().optional(),
});

export const lineItemStockEntry = z.object({
  sourceWarehouse: z.number().optional(),
  sourceWarehouseName: z.string().optional(),
  targetWarehouse: z.number().optional(),
  targetWarehouseName: z.string().optional(),
});

export const deliveryLineItem = z.object({
  sourceWarehouseID: z.number().optional(),
  sourceWarehouse: z.string().optional(),
});

export const lineItemSchema = z.object({
  itemLineID: z.number().optional(),
  quantity: z.coerce.number().optional(),
  rate: z.coerce.number(),
  itemID: z.number(),
  unitOfMeasureID: z.number(),

  lineType: z.string(),
  itemLineReferenceID: z.number().optional().nullable(),
  lineItemReceipt: lineItemReceipt.optional(),
  lineItemStockEntry: lineItemStockEntry.optional(),
  deliveryLineItem: deliveryLineItem.optional(),
  amount: z.number().optional(),

  uom: z.string(),

  item_name: z.string(),
  item_code: z.string(),

  party_type: z.string().optional(),
});

export type ProductListSchema = z.infer<typeof productListSchema>;

export const productListSchema = z.object({
  party_id: z.number(),
  party_type: z.string(),
  lines: z.array(lineItemSchema),
});

export const mapToProductListData = (e: ProductListSchema) => {
  const d: components["schemas"]["ProductListData"] = {
    party_id: e.party_id,
    party_type: e.party_type,
    lines: e.lines.map((t) => schemaToLineItemData(t)),
  };
  return d;
};
