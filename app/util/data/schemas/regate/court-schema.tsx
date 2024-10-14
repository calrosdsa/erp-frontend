import { z } from "zod";


export const createCourtSchema = z.object({
    name:z.string(),
    enabled:z.boolean()
})