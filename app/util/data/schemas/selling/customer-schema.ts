import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { contactDataSchema } from "../contact/contact.schema";


export const createCustomerSchema = z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    customerType:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    groupID:z.number().optional(),
    group:z.string().optional(),

    contactData:contactDataSchema.optional(),
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