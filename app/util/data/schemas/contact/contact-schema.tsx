
import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";

export const createContactSchema = z.object({
    givenName:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    familyName:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    email:z.string().email(),
    gender:z.string().optional(),
    phoneNumber:z.string().optional(),
    partyReferenceId:z.number().optional(),

})

