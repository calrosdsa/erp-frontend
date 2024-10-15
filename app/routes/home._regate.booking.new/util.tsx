

import { parse, set } from 'date-fns'
import { z } from 'zod'
import { components } from '~/sdk'
import { createBookingSchema } from '~/util/data/schemas/regate/booking-schema'
import { generateTimeIntervals } from '../home._regate.court.$name/util/generate-court-rate-interval'

export const mapToBookingData = (values:z.infer<typeof createBookingSchema>
):components["schemas"]["BookingData"][] =>{
    let res:components["schemas"]["BookingData"][] = []
    const d:components["schemas"]["BookingData"] = {
        court_id:values.courtID,
        day_week:values.date.getDay(),
        start_date:toISOLocal(combineDateTime(values.date,values.startTime)),
        end_date:toISOLocal(combineDateTime(values.date,values.endTime)),
        times:generateTimeIntervals(values.startTime,values.endTime),
        is_valid:true
    }
    res.push(d)
    return res
}

function toISOLocal(d:Date) {
  var z  = (n:number) =>  ('0' + n).slice(-2);
  var zz = (n:number) => ('00' + n).slice(-3);
  var off = d.getTimezoneOffset();
  var sign = off > 0? '-' : '+';
  off = Math.abs(off);

  return d.getFullYear() + '-'
         + z(d.getMonth()+1) + '-' +
         z(d.getDate()) + 'T' +
         z(d.getHours()) + ':'  + 
         z(d.getMinutes()) + ':' +
         z(d.getSeconds()) + '.' +
         zz(d.getMilliseconds()) +
         sign + z(off/60|0) + ':' + z(off%60); 
}

export const combineDateTime = (dateObj: Date, timeString: string):Date =>{
  try {
    // Parse the time string
    const parsedTime = parse(timeString, 'hh:mm a', new Date())
    
    // Combine the date and time
    const combinedDateTime = set(dateObj, {
      hours: parsedTime.getHours(),
      minutes: parsedTime.getMinutes(),
      seconds: 0, // Reset seconds to 0
      milliseconds: 0 // Reset milliseconds to 0
    })
    console.log(combinedDateTime)
    return combinedDateTime
  } catch (error) {
    console.error('Error combining date and time:', error)
    throw new Error('Invalid date or time format')
  }
}
