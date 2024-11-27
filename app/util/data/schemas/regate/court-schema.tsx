import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";


export const createCourtSchema = z.object({
    name:z.string(),
    // enabled:z.boolean()
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
    isEdit:z.boolean(),
    courtRateIntervals:z.array(courtRateInterval)
})

export const editCourtSchema = z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    courtID:z.number(),
  });

