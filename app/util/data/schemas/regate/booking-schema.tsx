import { z } from "zod";


export const createBookingsSchema = z.object({
    customerID:z.number(),
    customerName:z.string(),
    advancePayment:z.coerce.number(),
})

export const validateBookingSchema = z.object({
    date:z.date(),
    startTime:z.string(),
    endTime:z.string(),

    // partyName:z.string(),
    // partyID:z.number(),

    // totalPrice:z.coerce.number(),
    // paid:z.coerce.number(),
    courtID:z.number(),

    repeat:z.enum(["DAYLY","WEEKLY","MONTHLY"]).optional(),
    repeatUntilDate:z.date().optional(),
    daysWeek:z.array(z.number()).optional(),
    // total:z
})