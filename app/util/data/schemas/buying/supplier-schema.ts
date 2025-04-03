import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { contactDataSchema, mapToContactData } from "../contact/contact.schema";
import { components } from "~/sdk";
import { field, fieldNull } from "..";

export type SupplierData = z.infer<typeof supplierSchema>
export const supplierSchema = z.object({
    supplierID:z.number().optional(),
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    group:fieldNull.optional(),
    contacts:z.array(contactDataSchema),
})





export const mapToSupplierData = (e:SupplierData) =>{
    const d:components["schemas"]["SupplierData"] = {
        id:e.supplierID,
        contacts:e.contacts.map(t=>mapToContactData(t)),
        fields: {
            group_id: e.group?.id,
            name: e.name
        }
    }
    return d
}