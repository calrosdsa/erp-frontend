import { z } from "zod";
import { fieldNull } from "..";
import { components } from "~/sdk";

export type AddressAndContactDataType = z.infer<typeof addressAndContactSchema>

export const addressAndContactSchema = z.object({
    id:z.number(),
    party_type:z.string(),
    shipping_address:fieldNull,
    billing_address:fieldNull,
    party_address:fieldNull,
    contact:fieldNull,
    
})

export const mapToAddressAndContactData  = (e:AddressAndContactDataType) =>{
    const d:components["schemas"]["AddressAndContactData"] = {
        fields: {
            billing_address_id: e.billing_address?.id,
            contact_id: e.contact?.id,
            shipping_address_id: e.shipping_address?.id,
            party_address_id: e.party_address?.id
        },
        id: e.id,
        party_type:e.party_type,
    }
    return d
}