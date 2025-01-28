import { z } from "zod";
import { fieldNull } from "..";
import { components } from "~/sdk";

export type AddressAndContactDataType = z.infer<typeof addressAndContactSchema>

export const addressAndContactSchema = z.object({
    id:z.number(),
    party_type:z.string(),
    shipping_address_id:z.number().optional().nullable(),
    shipping_address_name:z.string().optional().nullable(),
    billing_address_id:z.number().optional().nullable(),
    billing_address_name:z.string().optional().nullable(),
    party_address_id:z.number().optional().nullable(),
    party_address_name:z.string().optional().nullable(),
    
    contact_id:z.number().optional().nullable(),
    contact_name:z.string().optional().nullable(),
})

export const mapToAddressAndContactData  = (e:AddressAndContactDataType) =>{
    const d:components["schemas"]["AddressAndContactData"] = {
        fields: {
            billing_address_id: e.billing_address_id,
            contact_id: e.contact_id,
            shipping_address_id: e.shipping_address_id,
            party_address_id: e.party_address_id
        },
        id: e.id,
        party_type:e.party_type,
    }
    return d
}