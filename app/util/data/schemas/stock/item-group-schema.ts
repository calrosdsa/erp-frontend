import { z } from "zod";



export const createItemGroupSchema = z.object({
    name:z.string().min(4)
})