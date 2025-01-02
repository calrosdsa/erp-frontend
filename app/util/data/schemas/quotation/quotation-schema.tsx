import { z } from "zod";
import { lineItemSchema } from "../stock/line-item-schema";
import { mapToTaxAndChargeData, taxAndChargeSchema } from "../accounting/tax-and-charge-schema";
import { field, fieldNull } from "..";
import { components } from "~/sdk";
import { formatRFC3339 } from "date-fns";
import { lineItemSchemaToLineData } from "../buying/order-schema";

export const createQuotationSchema = z
  .object({
    partyName:z.string(),
    partyID: z.number(),

    postingDate: z.date(),
    postingTime: z.string(),
    tz:z.string(),
    validTill:z.date(),
    currency: z.string(),

    project:z.string().optional(),
    projectID:z.number().optional(),

    costCenter:z.string().optional(),
    costCenterID:z.number().optional(),

    lines: z.array(lineItemSchema),
    taxLines: z.array(taxAndChargeSchema),
  })

  export const editQuotationSchema = z
  .object({
    id:z.number(),
    partyName:z.string(),
    partyID: z.number(),

    postingDate: z.date(),
    postingTime: z.string(),
    tz:z.string(),
    validTill:z.date(),
    currency: z.string(),

    projectName:z.string().optional(),
    projectID:z.number().optional(),

    costCenterName:z.string().optional(),
    costCenterID:z.number().optional(),
  })


  export const quotationDataSchema = z.object({
    id:z.number().optional(),
    party:field,
    // partyName:z.string(),
    // partyID: z.number(),

    postingDate: z.date(),
    postingTime: z.string(),
    tz:z.string(),
    validTill:z.date(),
    currency: z.string(),

    lines: z.array(lineItemSchema),
    taxLines: z.array(taxAndChargeSchema),

    priceList:fieldNull,
    project:fieldNull,
    costCenter:fieldNull,
  })

  export const mapToQuotationData =(
    e:z.infer<typeof quotationDataSchema>,
    docParty:string,
  ):components["schemas"]["QuotationBody"] =>{
    const lines = e.lines.map((t) => lineItemSchemaToLineData(t));
    const taxLines = e.taxLines.map((t) => mapToTaxAndChargeData(t));
    const d:components["schemas"]["QuotationData"] = {
      id:e.id,
      fields: {
        cost_center_id: e.costCenter?.id,
        currency: e.currency,
        party_id: e.party.id || 0,
        posting_date: formatRFC3339(e.postingDate),
        posting_time: e.postingTime,
        project_id: e.project?.id,
        price_list_id:e.priceList?.id,
        tz: e.tz,
        valid_till:formatRFC3339(e.validTill)
      },
      quotation_party_type: docParty
    }
    return {
      quotation:d,
      items:{
        lines:lines,
      },
      tax_and_charges:{
        lines:taxLines,
      },
    }
  }