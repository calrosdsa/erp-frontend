import {
  addDays,
  addMonths,
  getDaysInMonth,
  isBefore,
  isSameDay,
  parse,
  set,
  setDate,
} from "date-fns";
import { z } from "zod";
import { components } from "~/sdk";
import { validateBookingSchema } from "~/util/data/schemas/regate/booking-schema";
import { generateTimeIntervals } from "../home._regate.court.$id/util/generate-court-rate-interval";

export const mapToBookingData = (
  values: z.infer<typeof validateBookingSchema>
): components["schemas"]["BookingData"][] => {
  let res: components["schemas"]["BookingData"][] = [];

  const createBookingData = (
    date: Date
  ): components["schemas"]["BookingData"] => ({
    court_id: values.courtID,
    day_week: date.getDay(), // Adjusting to 1-7 range
    start_date: combineDateTime(date, values.startTime).toISOString(),
    end_date: combineDateTime(date, values.endTime).toISOString(),
    times: generateTimeIntervals(values.startTime, values.endTime),
    is_reserved: false,
    court_name: values.courtName,
    discount: values.discount,
  });

  if (values.repeatUntilDate && values.repeat) {
    let currentDate = new Date(values.date);

    while (
      isBefore(currentDate, values.repeatUntilDate) ||
      isSameDay(currentDate, values.repeatUntilDate)
    ) {
      if (values.repeat === "DAYLY") {
        res.push(createBookingData(currentDate));
        currentDate = addDays(currentDate, 1);
      } else if (values.repeat === "WEEKLY" && values.daysWeek) {
        if (values.daysWeek.includes(currentDate.getDay())) {
          res.push(createBookingData(currentDate));
        }
        currentDate = addDays(currentDate, 1);
      } else if (values.repeat === "MONTHLY") {
        if (currentDate.getDate() === values.repeatOnDay) {
          res.push(createBookingData(currentDate));
        } else if (currentDate.getDate() < Number(values.repeatOnDay)) {
          // Check if repeatOnDay is within the current month
          const daysInCurrentMonth = getDaysInMonth(currentDate);
          if (Number(values.repeatOnDay) <= daysInCurrentMonth) {
            const bookingDate = new Date(currentDate);
            bookingDate.setDate(Number(values.repeatOnDay));
            if (
              isBefore(bookingDate, values.repeatUntilDate) ||
              isSameDay(bookingDate, values.repeatUntilDate)
            ) {
              res.push(createBookingData(bookingDate));
            }
          }
        }

        currentDate = addMonths(currentDate, 1);

        // Adjust for months where repeatOnDay exceeds the number of days
        const daysInMonth = getDaysInMonth(currentDate);
        if (Number(values.repeatOnDay) > daysInMonth) {
          currentDate = setDate(currentDate, daysInMonth);
        } else {
          currentDate = setDate(currentDate, Number(values.repeatOnDay));
        }
      }
    }
  } else {
    res.push(createBookingData(values.date));
  }

  return res;
};

// export const mapToBookingData = (
//   values: z.infer<typeof validateBookingSchema>
// ): components["schemas"]["BookingData"][] => {
//   let res: components["schemas"]["BookingData"][] = [];
//   if (values.repeatUntilDate && values.repeat) {
//     if (values.repeat == "DAYLY") {
//       //Repeat from date to repeatUntilDate
//       //apend BookingData to res
//     }
//     if (values.repeat == "WEEKLY") {
//       //Repeat from date to  repeatUntilDate base on week days that is (daysWeek and array of number representing
//       // day week from 0 sunday to 6 saturday)

//       //apend BookingData to res

//     }
//   } else {
//     const d: components["schemas"]["BookingData"] = {
//       court_id: values.courtID,
//       day_week: values.date.getDay(),
//       start_date: combineDateTime(values.date, values.startTime).toISOString(),
//       end_date: combineDateTime(values.date, values.endTime).toISOString(),
//       times: generateTimeIntervals(values.startTime, values.endTime),
//       is_reserved: false,
//       court_name: values.courtName,
//     };
//     res.push(d);
//   }

//   return res;
// };

export const combineDateTime = (dateObj: Date, timeString: string): Date => {
  try {
    // Parse the time string
    const parsedTime = parse(timeString, "hh:mm a", new Date());

    // Combine the date and time
    const combinedDateTime = set(dateObj, {
      hours: parsedTime.getHours(),
      minutes: parsedTime.getMinutes(),
      seconds: 0, // Reset seconds to 0
      milliseconds: 0, // Reset milliseconds to 0
    });
    console.log(combinedDateTime);
    return combinedDateTime;
  } catch (error) {
    console.error("Error combining date and time:", error);
    throw new Error("Invalid date or time format");
  }
};
