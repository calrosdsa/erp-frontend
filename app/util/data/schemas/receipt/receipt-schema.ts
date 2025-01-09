import { z } from "zod";
import { supplierDtoSchema } from "../buying/supplier-schema";
import { currencySchema } from "../app/currency-schema";
import {
  lineItemSchema,
  lineItemReceipt,
  deliveryLineItem,
} from "../stock/line-item-schema";
import { ItemLineType, PartyType, partyTypeToJSON } from "~/gen/common";
import {
  mapToTaxAndChargeData,
  taxAndChargeSchema,
} from "../accounting/tax-and-charge-schema";
import validateRequiredField, { field, fieldNull } from "..";
import { components } from "~/sdk";
import { lineItemSchemaToLineData } from "../buying/order-schema";
import { formatRFC3339 } from "date-fns";

export const receiptDataSchema = z
  .object({
    id: z.number().optional(),
    docReferenceID: z.number().optional().nullable(),
    receiptPartyType: z.string(),
    party: field.optional(),

    // name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    postingDate: z.date(),
    postingTime: z.string(),
    tz: z.string(),
    currency: z.string(),

    warehouse: field.optional(),

    project: fieldNull,
    costCenter: fieldNull,
    priceList: fieldNull,

    lines: z.array(lineItemSchema),
    taxLines: z.array(taxAndChargeSchema),
  })
  .superRefine((data, ctx) => {
    validateRequiredField({
      data: {
        warehouse: data.warehouse?.id == undefined,
        party: data.party?.id == undefined,
      },
      ctx: ctx,
    });

    if (
      data.warehouse &&
      data.receiptPartyType == partyTypeToJSON(PartyType.purchaseReceipt)
    ) {
      data.lines = data.lines.map((t, i) => {
        const lineReceipt: z.infer<typeof lineItemReceipt> = {
          acceptedQuantity: t.lineItemReceipt?.acceptedQuantity || 0,
          rejectedQuantity: t.lineItemReceipt?.rejectedQuantity || 0,
          acceptedWarehouseID:
            t.lineItemReceipt?.acceptedWarehouseID || data.warehouse?.id,
          acceptedWarehouse:
            t.lineItemReceipt?.acceptedWarehouse || data.warehouse?.name,
          // rejectedWarehouseID:
          //   t.lineItemReceipt?.rejectedWarehouseID || data.warehouse.id,
          // rejectedWarehouse:
          //   t.lineItemReceipt?.rejectedWarehouse || data.ware,
        };
        t.lineItemReceipt = lineReceipt;
        return t;
      });
    }

    //For sale invoice
    if (
      data.warehouse &&
      data.receiptPartyType == partyTypeToJSON(PartyType.deliveryNote)
    ) {
      data.lines = data.lines.map((t, i) => {
        const deliveryLine: z.infer<typeof deliveryLineItem> = {
          sourceWarehouseID: data.warehouse?.id,
          sourceWarehouse: data.warehouse?.name,
        };
        t.deliveryLineItem = deliveryLine;
        return t;
      });
    }
  });
// E

export const mapToReceiptData = (
  e: z.infer<typeof receiptDataSchema>
): components["schemas"]["ReceiptBody"] => {
  const d: components["schemas"]["ReceiptData"] = {
    fields: {
      cost_center_id: e.costCenter?.id,
      currency: e.currency,
      doc_reference_id: e.docReferenceID || null,
      party_id: e.party?.id || 0,
      posting_date: formatRFC3339(e.postingDate),
      posting_time: e.postingTime,
      price_list_id: e.priceList?.id,
      project_id: e.project?.id,
      tz: e.tz,
      warehouse_id: e.warehouse?.id || 0,
    },
    id: e.id || 0,
    receipt_party_type: e.receiptPartyType,
  };
  return {
    receipt: d,
    items: {
      lines: e.lines.map((t) => lineItemSchemaToLineData(t)),
    },
    tax_and_charges: {
      lines: e.taxLines.map((t) => mapToTaxAndChargeData(t)),
    },
  };
};
