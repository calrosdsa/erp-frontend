import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";

export const createWarehouseSchema = z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    parentID:z.number().optional(),
    parentName:z.string().optional(),
    isGroup:z.boolean(),
})

export const editWarehouseSchema = z.object({
    id:z.number(),
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    parentID:z.number().optional(),
    parentName:z.string().optional(),
    isGroup:z.boolean(),
})

