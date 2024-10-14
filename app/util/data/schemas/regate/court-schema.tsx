import { z } from "zod";


export const createCourtSchema = z.object({
    name:z.string(),
    enabled:z.boolean()
})



export const courtRateInterval = z.object({
    start_time:z.string(),
    end_time:z.string(),
    rate:z.coerce.number(),
    enabled:z.boolean(),
})
export const updateCourtRateSchema = z.object({
    // courtRates:z.array(courtRateSchema)
    dayWeeks:z.array(z.number()),
    courtUUID:z.string(),
    courtRateIntervals:z.array(courtRateInterval)
})

