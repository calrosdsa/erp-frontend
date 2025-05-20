import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { components } from "~/sdk";

export type EventBookingSchema = z.infer<typeof eventBookingShema>

export const eventBookingShema = z.object({
    eventID:z.number().optional(),
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    description:z.string().optional().nullable(),
})


export const mapToEventBookingData = (e:EventBookingSchema)=>{
    const d:components["schemas"]["EventBookingData"] = {
        id:e.eventID,
        fields:{
            name:e.name,
            description:e.description
        }
    }
    return d
}