import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { groupSchema } from "../group-schema";


export const supplierDtoSchema=z.object({
    name:z.string(),
    uuid:z.string(),
    enabled:z.boolean(),
    created_at:z.string(),
})

export const createSupplierSchema = z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    groupName:z.string().optional(),
    group:groupSchema,
    enabled:z.boolean()
})