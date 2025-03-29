import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { contactDataSchema, mapToContactData } from "../contact/contact.schema";
import { components } from "~/sdk";
import { field, fieldNull } from "..";

export type CustomerData = z.infer<typeof customerSchema>
export const customerSchema = z.object({
    customerID:z.number().optional(),
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    customerType:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    group:fieldNull.optional(),
    contacts:z.array(contactDataSchema),
}).superRefine((data,ctx)=>{
    // if(data.contactData && (data.contactData.email || data.contactData.phone_number)){
    //     data.contactData.givenName = data.name
    // }
})


export const editCustomerSchema= z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    customerType:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    customerTypeValue:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    customerID:z.number(),
    groupName:z.string().optional().nullable(),
    groupUUID:z.string().optional().nullable(),
    groupID:z.number().optional().nullable(),   
})


export const mapToCustomerData = (e:CustomerData) =>{
    const d:components["schemas"]["CustomerData"] = {
        id:e.customerID,
        contacts:e.contacts.map(t=>mapToContactData(t)),
        fields: {
            customer_type: e.customerType,
            group_id: e.group?.id,
            name: e.name
        }
    }
    return d
}