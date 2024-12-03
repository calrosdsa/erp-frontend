import { z } from "zod";


export const updateClientSchema = z.object({
    givenName:z.string().min(4).max(100),
    familyName:z.string().min(1).max(100),
    phoneNumber:z.string(),
    // countryCode:z.string(),
    // organizationName:z.string(),
})