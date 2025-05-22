import { z } from "zod";
import { field, fieldNull, fieldRequired } from "..";
import { components } from "~/sdk";
import { formatAmountToInt } from "~/util/format/formatCurrency";
import { formatRFC3339 } from "date-fns";
import { contactBulkDataSchema, contactDataSchema, mapToContactData } from "../contact/contact.schema";

export type DealData = z.infer<typeof dealSchema>
export type ParticipantData = z.infer<typeof observerSchema>

export const observerSchema = z.object({
    profile_id:z.number(),
    name:z.string(),
    _action:z.string().optional(),
})

export const dealSchema = z.object({
    id:z.number().optional(),
    name:z.string(),
    stage:fieldRequired,
    customer:fieldNull,
    amount:z.coerce.number(),
    currency:fieldRequired,
    deal_type:z.string().nullable().optional(),
    source:z.string().nullable().optional(),
    source_information:z.string().nullable().optional(),
    start_date:z.date(),
    end_date:z.date().optional().nullable(),
    available_for_everyone:z.boolean(),
    responsible:fieldRequired,
    contacts:z.array(contactDataSchema),
    index:z.number(),
    observers:z.array(observerSchema),
})

export const mapToParticipantData = (e:ParticipantData) =>{
    const d:components["schemas"]["ParticipantData"] = {
        action: e._action,
        id:e.profile_id,
    }
    return d
}

export const mapToDealData = (e:DealData) => {
    const d:components["schemas"]["DealData"] = {
        fields: {
            amount: formatAmountToInt(e.amount),
            currency: e.currency.name,
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
            customer_id:e.customer?.id,
        },
        id: e.id || 0,
        contacts:e.contacts.map(t=>mapToContactData(t)),
        participants:e.observers.map(t=>mapToParticipantData(t)),
    }
    return d
}

export const mapToParticipantSchema = (e:components["schemas"]["ProfileDto"]) =>{
    const d:ParticipantData = {
        name: e.full_name,
        profile_id: e.id,
    }
    return d
}