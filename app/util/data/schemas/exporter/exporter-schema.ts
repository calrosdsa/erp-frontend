import { z } from "zod";


export const exportDataSchema = z.object({
    fromDate:z.date().optional(),
    toDate:z.date().optional(),
    path:z.string(),
    data:z.string(),
})

