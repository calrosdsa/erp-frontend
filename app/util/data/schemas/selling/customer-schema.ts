import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { createContactSchema } from "../contact/contact-schema";


export const createCustomerSchema = z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    customerType:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    groupID:z.number().optional(),
    groupName:z.string().optional(),

    contactData:createContactSchema.optional(),
}).superRefine((data,ctx)=>{
    if(data.contactData && (data.contactData.email || data.contactData.phoneNumber)){
        data.contactData.givenName = data.name
    }
})


export const editCustomerSchema= z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    customerType:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    customerID:z.number(),
    groupID:z.number().optional(),
})