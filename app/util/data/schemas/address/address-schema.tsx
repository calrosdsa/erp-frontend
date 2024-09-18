import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";

export const createAddressSchema = z.object({
    title:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    city:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    streetLine1:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    streetLine2:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    company:z.string().optional(),
    province:z.string().optional(),
    phoneNumber:z.string().optional(),
    email:z.string().optional(),
    countryCode:z.string().optional(),
    postalCode:z.string().optional(),
    identificationNumber:z.string().optional(),
})

