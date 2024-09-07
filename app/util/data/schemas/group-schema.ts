import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";

export const groupSchema = z.object({
    name:z.string(),
    is_group:z.boolean(),
    ordinal:z.number(),
    created_at:z.string(),
    uuid:z.string(),
})

export const createGroupSchema = z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    is_group:z.boolean().default(false),
    parent:groupSchema.optional(),
    party_type_code:z.string(),
})