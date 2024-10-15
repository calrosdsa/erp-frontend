import { parse, format, addMinutes, isBefore, isEqual, setHours, setMinutes, setSeconds, setMilliseconds, interval } from 'date-fns';    
import { z } from 'zod';
import { components } from '~/sdk';
import { updateCourtRateSchema } from '~/util/data/schemas/regate/court-schema';

export const mapToCourtRateData = (d:z.infer<typeof updateCourtRateSchema>):components["schemas"]["CourtRateData"][] => {
    let courtRates:components["schemas"]["CourtRateData"][]= []
    d.dayWeeks.map((day)=>{
        d.courtRateIntervals.map((t)=>{
            const timeInterval = generateTimeIntervals(t.start_time,t.end_time)
            const courtRatesDay:components["schemas"]["CourtRateData"][] = timeInterval.map((time)=>{
                return {
                    rate:t.rate,
                    time:time,
                    enabled:t.enabled,
                    day_week:day
                }
            })
            courtRates = [...courtRates,...courtRatesDay]
        })
    })
    return courtRates
}

export const generateTimeIntervals =(startTime: string, endTime: string): string[] => {
    const parseTime = (time: string): Date => {
      // const parsedTime = parse(time, 'hh:mm a', new Date());
      const parsedTime = parse(time, 'hh:mm a', new Date());

      return setSeconds(setMilliseconds(parsedTime, 0), 0);
    };
    const formatTime = (date: Date): string => {
      return format(date, 'HH:mm:ss');
      // return format(date, 'hh:mm a');
    };
    let start = parseTime(startTime);
    let end = parseTime(endTime);
  
    // Handle case where end time is on the next day
    if (isBefore(end, start) || isEqual(end, start)) {
      end = setHours(setMinutes(end, end.getMinutes()), end.getHours() + 24);
    }
  
    const intervals: string[] = [];
    let current = start;
  
    while (isBefore(current, end) || isEqual(current, end)) {
      intervals.push(formatTime(current));
      current = addMinutes(current, 30);
    }
  
    // Remove the last interval if it exceeds the end time
    if (intervals.length > 1 && isBefore(end, parseTime(intervals[intervals.length - 1] || ""))) {
      intervals.pop();
    }
    //Pop the last one
    intervals.pop();
    return intervals;
  }
    