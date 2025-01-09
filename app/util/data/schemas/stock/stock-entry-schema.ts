import { z } from "zod";
import {
  ItemLineType,
  StockEntryType,
  stockEntryTypeFromJSON,
  stockEntryTypeToJSON,
} from "~/gen/common";
import { lineItemSchema, lineItemStockEntry } from "./line-item-schema";
import validateRequiredField, { field, fieldNull } from "..";
import { components } from "~/sdk";
import { formatRFC3339 } from "date-fns";
import { lineItemSchemaToLineData } from "../buying/order-schema";

export const stockEntryDataSchema = z
  .object({
    id: z.number().optional(),
    postingDate: z.date(),
    postingTime: z.string(),
    tz: z.string(),
    currency: z.string(),

    entryType: z.string(),

    sourceWarehouse: fieldNull,
    targetWarehouse: fieldNull,

    project: fieldNull,
    costCenter: fieldNull,

    items: z.array(lineItemSchema),
  })
  .superRefine((data, ctx) => {
    const entryType = stockEntryTypeFromJSON(data.entryType);
    validateRequiredField({
      data: {
        sourceWarehouse:
          entryType == StockEntryType.MATERIAL_ISSUE &&
          data.sourceWarehouse?.id == undefined,
        targetWarehouse:
          entryType == StockEntryType.MATERIAL_RECEIPT &&
          data.targetWarehouse?.id == undefined,
      },
      ctx: ctx,
    });
    if (data.items.length == 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: {
          i18n: { key: "custom.required" },
        },
        path: ["items"],
      });
    }
    data.items = data.items.map((t, i) => {
      const lineReceipt: z.infer<typeof lineItemStockEntry> = {
        sourceWarehouse:
          t.lineItemStockEntry?.sourceWarehouse ||
          data.sourceWarehouse?.id ||
          undefined,
        sourceWarehouseName:
          t.lineItemStockEntry?.sourceWarehouseName ||
          data.sourceWarehouse?.name ||
          undefined,
        targetWarehouse:
          t.lineItemStockEntry?.targetWarehouse ||
          data.targetWarehouse?.id ||
          undefined,
        targetWarehouseName:
          t.lineItemStockEntry?.targetWarehouseName ||
          data.targetWarehouse?.name ||
          undefined,
      };
      t.lineItemStockEntry = lineReceipt;
      return t;
    });
  });
// E

export const mapToStockEntryBody = (
  e: z.infer<typeof stockEntryDataSchema>
): components["schemas"]["StockEntryBody"] => {
  const d: components["schemas"]["StockEntryData"] = {
    fields: {
      cost_center_id: e.costCenter?.id,
      currency: e.currency,
      entry_type: e.entryType,
      posting_date: formatRFC3339(e.postingDate),
      posting_time: e.postingTime,
      project_id: e.project?.id,
      tz: e.tz,
      source_warehouse_id: e.sourceWarehouse?.id,
      target_warehouse_id: e.targetWarehouse?.id,
    },
    id: e.id || 0,
  };
  return {
    stock_entry: d,
    items: {
      lines: e.items.map((t) => lineItemSchemaToLineData(t)),
    },
  };
};
