import { z } from "zod";
import { MAX_LENGTH, MIN_LENGTH } from "~/constant";


export const addWareHouseSchema = z.object({
    name:z.string().min(MIN_LENGTH).max(MAX_LENGTH),
    parentID:z.number().optional(),
    enabled:z.boolean(),
})