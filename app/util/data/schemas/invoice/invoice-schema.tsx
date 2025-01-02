import { z } from "zod";
import { supplierDtoSchema } from "../buying/supplier-schema";
import { currencySchema } from "../app/currency-schema";
import {
  deliveryLineItem,
  lineItemReceipt,
  lineItemSchema,
} from "../stock/line-item-schema";
import { mapToTaxAndChargeData, taxAndChargeSchema } from "../accounting/tax-and-charge-schema";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { field, fieldNull } from "..";
import { components } from "~/sdk";
import { formatRFC3339 } from "date-fns";
import { lineItemSchemaToLineData } from "../buying/order-schema";

export const invoiceDataSchema = z
  .object({
    id: z.number().optional(),
    invoicePartyType: z.string(),
    party: field.optional(),

    docReferenceID: z.number().optional().nullable(),
    // name: z.string().min(DEFAULT_MIN_LENGTH).maxe.dueDEFAULT_MAX_LENGTH),
    dueDate: z.date().optional().nullable(),

    postingDate: z.date(),
    postingTime: z.string(),
    tz: z.string(),
    currency: z.string(),

    updateStock: z.boolean().optional(),

    warehouse:fieldNull,
    // acceptedWarehouseID: z.number().optional(),
    // warehouse: z.string().optional(),

    // rejectedWarehouseID: z.number().optional(),
    // rejectedWarehouseName: z.string().optional(),

    project: fieldNull,
    costCenter: fieldNull,
    priceList: fieldNull,

    lines: z.array(lineItemSchema),
    taxLines: z.array(taxAndChargeSchema),
  })
  .superRefine((data, ctx) => {
    if (data.party?.id == undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: {
          i18n: { key: "custom.required" },
        },
        path: ["party"],
      });
    }
    if (data.updateStock) {
      //For purchase invoice
      if (data.warehouse && data.warehouse.id) {
        data.lines = data.lines.map((t, i) => {
          const receiptLineItem: z.infer<typeof lineItemReceipt> = {
            acceptedWarehouseID:
              t.lineItemReceipt?.acceptedWarehouseID ||
              data.warehouse?.id || undefined,
            acceptedWarehouse:
              t.lineItemReceipt?.acceptedWarehouse ||
              data.warehouse?.name || undefined,
            rejectedWarehouseID:
              t.lineItemReceipt?.rejectedWarehouseID ||
              data.warehouse?.id || undefined,
            rejectedWarehouse:
              t.lineItemReceipt?.rejectedWarehouse ||
              data.warehouse?.name || undefined,
            acceptedQuantity:
              t.lineItemReceipt?.acceptedQuantity || t.quantity || 0,
            rejectedQuantity: t.lineItemReceipt?.rejectedQuantity || 0,
          };
          t.lineItemReceipt = receiptLineItem;
          return t;
        });
      } else if (
        data.invoicePartyType == partyTypeToJSON(PartyType.purchaseInvoice)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            i18n: { key: "custom.required" },
          },
          path: ["warehouse"],
        });
      }
      //For sale invoice
      if (data.warehouse && data.warehouse.id) {
        data.lines = data.lines.map((t, i) => {
          const deliveryLine: z.infer<typeof deliveryLineItem> = {
            sourceWarehouseID: data.warehouse?.id || undefined,
            sourceWarehouse: data.warehouse?.name || undefined,
          };
          t.deliveryLineItem = deliveryLine;
          return t;
        });
      } else if (
        data.invoicePartyType == partyTypeToJSON(PartyType.saleInvoice)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            i18n: { key: "custom.required" },
          },
          path: ["sourceWarehouseName"],
        });
      }
    }
  });

export const editInvoiceSchema = z.object({
  id: z.number(),
  partyName: z.string(),
  partyID: z.number(),

  postingDate: z.date(),
  postingTime: z.string(),
  tz: z.string(),
  dueDate: z.date().optional(),
  currency: z.string(),
  // recordNo:z.string().optional(),

  projectName: z.string().optional(),
  projectID: z.number().optional(),

  costCenterName: z.string().optional(),
  costCenterID: z.number().optional(),
});

export const mapToInvoiceBody = (
  e: z.infer<typeof invoiceDataSchema>
): components["schemas"]["InvoiceBody"] => {
  const d: components["schemas"]["InvoiceData"] = {
    id: e.id,
    fields: {
      cost_center_id: e.costCenter?.id,
      currency: e.currency,
      doc_reference_id: e.docReferenceID,
      due_date: e.dueDate ? formatRFC3339(e.dueDate) : undefined,
      party_id: e.party?.id || 0,
      posting_date: formatRFC3339(e.postingDate),
      posting_time: e.postingTime,
      price_list_id: e.priceList?.id,
      project_id: e.project?.id,
      tz: e.tz,
      warehouse_id:e.warehouse?.id
    },
    invoice_party_type: e.invoicePartyType,
    total_amount: e.lines.reduce(
      (prev, curr) => prev + Number(curr.quantity) * curr.rate,
      0
    ) +
    e.taxLines.reduce((prev, curr) => prev + Number(curr.amount), 0),
  };
  return {
    invoice:d,
    items:{
      update_stock:e.updateStock,
      lines:e.lines.map((t) => lineItemSchemaToLineData(t))
    },
    tax_and_charges:{
      lines:e.taxLines.map((t) => mapToTaxAndChargeData(t))
    }
  };
};
