import {
  parse,
  addMinutes,
  isSameDay,
  format,
  differenceInMinutes,
} from "date-fns";
import { components } from "~/sdk";

// const input = {
//   court: 305,
//   courtName: "Cancha 1",
//   selectedSlots: [
//     "2024-11-18 05:30:00",
//     "2024-11-18 07:00:00",
//     "2024-11-18 07:30:00",
//     "2024-11-19 05:30:00",
//     "2024-11-19 06:00:00",
//   ],
// };

function generateTimeIntervals(startTime: string, endTime: string) {
  const times = [];
  let currentTime = parse(startTime, "HH:mm:ss", new Date());
  const end = parse(endTime, "HH:mm:ss", new Date());

  while (currentTime < end) {
    times.push(format(currentTime, "HH:mm:ss"));
    currentTime = addMinutes(currentTime, 30);
  }

  return times;
}

const areTimesConsecutive = (startTime: Date, endTime: Date): boolean => {
  return differenceInMinutes(endTime, startTime) === 30; // Assuming the time slots are always in 30-minute intervals
};

export default function generateBookingData(
  court: number,
  courtName: string,
  selectedSlots: string[]
) {
  const bookingData: components["schemas"]["BookingData"][] = [];
  const groupedSlots: Record<string, string[]> = {};

  // Group slots by date
  selectedSlots.forEach((slot) => {
    console.log(new Date(slot));
    const date = new Date(slot);
    if (!groupedSlots[format(date, "yyyy-MM-dd")]) {
      groupedSlots[format(date, "yyyy-MM-dd")] = [];
    }
    groupedSlots[format(date, "yyyy-MM-dd")]?.push(format(date, "HH:mm:ss"));
  });

  // Process each date
  Object.entries(groupedSlots).forEach(([date, tms]) => {
    console.log("CURRENT DATE -----------", date);
    // console.log("SORT",times,times.sort())
    const times = tms.sort();
    let timeIntervals: string[][] = [];
    const size = times.length;
    const generateInterval = (idx: number) => {
      if (idx == size) {
        return;
      }
      let interval: string[] = [];
      console.log(idx);
      for (let i = idx; i < times.length; i++) {
        let current = new Date(`${date} ${times[i]}`);
        if (i < size - 1) {
          let next = new Date(`${date} ${times[i + 1]}`);
          console.log("DIFERENCE", differenceInMinutes(next, current));
          if (differenceInMinutes(next, current) > 30) {
            interval = [...interval, times[i] || ""];
            generateInterval(i + 1);
            break;
          } else {
            interval = [...interval, times[i] || ""];
          }
        } else {
          interval = [...interval, times[i] || ""];
        }
      }
      timeIntervals.push(interval);
    };
    generateInterval(0);
    const currentDate = new Date(date);
    for (let i = 0; i <= timeIntervals.length; i++) {
      const timeInterval = timeIntervals[i];
      if (timeInterval) {
        const startTime = timeInterval[0];
        const endTime = timeInterval[timeInterval.length - 1];
        const startDate = new Date(`${date} ${startTime}`);
        const endDate = new Date(`${date} ${endTime}`);
        bookingData.push({
          court_id: court,
          court_name: courtName,
          day_week: startDate.getDay(),
          start_date: startDate.toISOString(),
          end_date: addMinutes(endDate,30).toISOString(),
          times: timeInterval,
          is_reserved: false,
        });
      }
    }
  });

  return bookingData;
}

// const result = generateBookingData(input);
// console.log(JSON.stringify(result, null, 2));
