import { z } from "zod";
import { MAX_LENGTH, MIN_LENGTH } from "~/constant";


export const createWareHouseSchema = z.object({
    name:z.string().min(MIN_LENGTH).max(MAX_LENGTH),
    isGroup:z.boolean(),
    enabled:z.boolean(),
})