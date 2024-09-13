import { z } from "zod";

export const keyValue = z.object({
    key:z.string().min(1).max(50),
    value:z.string().min(1).max(50),
})

export const createUserSchema = z.object({
    email:z.string().email(),
    roleUuid:z.string(),
    roleName:z.string(),
    partyCode:z.string(),
    companyIds:z.array(z.number()),
    givenName:z.string().min(3).max(50),
    familyName:z.string().min(3).max(50),
    phoneNumber:z.string().max(50).optional(),
    keyValue:z.array(keyValue).optional(),
})