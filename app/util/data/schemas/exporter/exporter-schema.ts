import { z } from "zod";


export const exportDataSchema = z.object({
    fromDate:z.date(),
    toDate:z.date(),
    path:z.string()
})