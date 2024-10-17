import { z } from "zod";
import { DEFAULT_MIN_LENGTH } from "~/constant";


export const createEventSchema = z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH),
    description:z.string().optional()
})