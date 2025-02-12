import { z } from "zod";

export const createBookingsSchema = z.object({
  customerID: z.number(),
  customerName: z.string(),

  eventID: z.number().optional(),
  eventName: z.string().optional(),

  advancePayment: z.coerce.number().optional(),
  discount: z.coerce.number().optional(),
  comment:z.string().optional(),
});

export const validateBookingSchema = z.object({
  date: z.date(),
  startTime: z.string(),
  endTime: z.string(),

  courtID: z.number(),
  courtName: z.string(),

  repeat: z.enum(["DAYLY", "WEEKLY", "MONTHLY"]).optional(),
  repeatUntilDate: z.date().optional(),
  repeatOnDay: z.coerce.number().min(0).max(31).optional(),
  daysWeek: z.array(z.number()).optional(),

  bookingID: z.number().optional(),
  discount: z.coerce.number().optional(),

  // total:z
});

export const editPaidAmountSchema = z
  .object({
    addedAmount: z.coerce.number(),
    totalPrice: z.number(),
    paidAmount: z.number(),
    bookingID: z.number(),
  })
  .superRefine((data, ctx) => {
    //Validate paidAmount is  not greated  that total price of the booking
    if (data.paidAmount > data.totalPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Error: El monto pagado no puede ser mayor que el precio total de la reserva.",
        path: ["addedAmount"],
      });
    }
    if (data.paidAmount < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Error: El monto pagado no puede ser menor a 0",
        path: ["addedAmount"],
      });
    }
  });
