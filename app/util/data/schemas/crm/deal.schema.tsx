import { z } from "zod";
import { field, fieldRequired } from "..";
import { components } from "~/sdk";
import { formatAmountToInt } from "~/util/format/formatCurrency";
import { formatRFC3339 } from "date-fns";
import { contactBulkDataSchema, contactDataSchema, mapToContactBulkData } from "../contact/contact.schema";

export type DealData = z.infer<typeof dealSchema>

export const dealSchema = z.object({
    id:z.number().optional(),
    name:z.string(),
    stage:fieldRequired,
    amount:z.coerce.number(),
    currency:z.string(),
    deal_type:z.string().nullable().optional(),
    source:z.string().nullable().optional(),
    source_information:z.string().nullable().optional(),
    start_date:z.date(),
    end_date:z.date().optional().nullable(),
    available_for_everyone:z.boolean(),
    responsible:fieldRequired,
    contacts:z.array(contactDataSchema),
    index:z.number(),
})

export const mapToDealData = (e:DealData) => {
    const d:components["schemas"]["DealData"] = {
        fields: {
            amount: formatAmountToInt(e.amount),
            currency: e.currency,
            deal_type: e.deal_type,
            name: e.name,
            responsible_id: e.responsible.id,
            source: e.source,
            source_information: e.source_information,
            stage_id: e.stage.id,
            start_date: formatRFC3339(e.start_date),
            end_date:e.end_date ? formatRFC3339(e.end_date) : undefined,
            available_for_everyone:e.available_for_everyone,
            index:e.index,
        },
        id: e.id || 0,
        contact_bulk:e.cont
    }
    return d
}