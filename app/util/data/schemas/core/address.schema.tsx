import { z } from "zod";
import { DEFAULT_MIN_LENGTH } from "~/constant";
import { components } from "~/sdk";

export type AddressSchema = z.infer<typeof addressSchema>

export const addressSchema = z.object({
  addressID:z.number().optional(),
  title: z.string().min(DEFAULT_MIN_LENGTH),
  streetLine1:z.string().min(DEFAULT_MIN_LENGTH),
  streetLine2:z.string().min(DEFAULT_MIN_LENGTH),
  city:z.string().min(DEFAULT_MIN_LENGTH),
  isShippingAddress:z.boolean(),
  isBillingAddress:z.boolean(),
  company:z.string().optional().nullable(),
  province:z.string().optional().nullable(),
  postalCode:z.string().optional().nullable(),
  phoneNumber:z.string().optional().nullable(),
  countryCode:z.string().optional().nullable(),
  identificationNumber:z.string().optional().nullable(),
  email:z.string().optional().nullable(),
  referenceID:z.number().optional().nullable(),
  action:z.string().optional(),
});

export const mapToAddressData = (e:AddressSchema) =>{
    const d:components["schemas"]["AddressData"] = {
        id:e.addressID,
        reference_id:e.referenceID,
        action:e.action,
        fields:{
            title: e.title,
            city: e.city,
            street_line1: e.streetLine1,
            street_line2:e.streetLine2,
            is_billing_address: e.isBillingAddress,
            is_shipping_address: e.isShippingAddress,
            province: e.province,
            company:e.company,
            postal_code:e.postalCode,
            phone_number:e.phoneNumber,
            country_code:e.countryCode,
            identification_number:e.identificationNumber,
            email:e.email,
        }
    }
    return d
}