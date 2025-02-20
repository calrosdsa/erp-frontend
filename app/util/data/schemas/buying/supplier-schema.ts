import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { groupSchema } from "../group-schema";
import { contactDataSchema } from "../contact/contact.schema";


export const supplierDtoSchema=z.object({
    id:z.number().optional(),
    name:z.string(),
    uuid:z.string(),
    enabled:z.boolean().optional(),
    created_at:z.string().optional(),
})

export const createSupplierSchema = z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    group:z.string().optional(),
    groupID:z.number().optional(),
    contactData:contactDataSchema.optional(),
}).superRefine((data,ctx)=>{
    // if(data.contactData && (data.contactData.email || data.contactData.phone_number)){
    //     data.contactData.givenName = data.name
    // }
})

export const editSupplier = z.object({
    id:z.number(),
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    group:z.string().optional(),
    groupID:z.number().optional(),  
    groupUUID:z.string().optional(),
}).superRefine((data,ctx)=>{
    if(!data.group){
        data.groupID = undefined
        data.groupUUID = undefined
    }
})