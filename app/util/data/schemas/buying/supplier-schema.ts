import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { groupSchema } from "../group-schema";


export const supplierDtoSchema=z.object({
    id:z.number().optional(),
    name:z.string(),
    uuid:z.string(),
    enabled:z.boolean().optional(),
    created_at:z.string().optional(),
})

export const createSupplierSchema = z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    groupName:z.string().optional(),
    groupID:z.number(),
    enabled:z.boolean(),
})