import { addDays, endOfMonth, format, setHours, setMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { es } from "date-fns/locale";
import { DEFAULT_CURRENCY } from "~/constant";
import { ChartType, chartTypeToJSON, TimeUnit } from "~/gen/common";
import { daysWeek } from "~/util/data/day-weeks";
import { months } from "~/util/data/moths";
import { formatCurrency } from "~/util/format/formatCurrency";
import { formatDateUTC } from "~/util/format/formatDate";

export const formatterValue = (
  chart: ChartType,
  value: string,
  lng: string
): string => {
  switch (chart) {
    case ChartType.INCOME:
    case ChartType.INCOME_AVG: {
      return  formatCurrency(Number(value),DEFAULT_CURRENCY,lng)
    }
    case ChartType.BOOKING_HOUR:
    case ChartType.BOOKING_HOUR_AVG:{
      const hours = Math.floor((Number(value)*30) / 60);
      const remainingMinutes = (Number(value)*30) % 60;
      return `${hours} h${hours !== 1 ? 's' : ''} ${remainingMinutes} m${remainingMinutes !== 1 ? 's' : ''}`
    }
    default:
      return value;
  }
};

export const getChartName = (
  chart: ChartType,
  timeUnit: TimeUnit,
  value: string,
  lng: string
): string => {
  switch (chart) {
    case ChartType.BOOKING_HOUR:
    case ChartType.INCOME:
      switch (timeUnit) {
        case TimeUnit.month: {
          const start = new Date(value).toLocaleDateString(lng, {
            month: "short",
            day: "numeric",
          });
          const end = endOfMonth(
            addDays(new Date(value), 1)
          ).toLocaleDateString(lng, {
            month: "short",
            day: "numeric",
          });
          return `${start}-${end}`;
        }
        case TimeUnit.week: {
          const start = new Date(value).toLocaleDateString(lng, {
            month: "short",
            day: "numeric",
          });
          const end = addDays(new Date(value), 7).toLocaleDateString(lng, {
            month: "short",
            day: "numeric",
          });
          return `${start}-${end}`;
        }
        case TimeUnit.day:
        default:
          const date = new Date(value);
          return formatDateUTC(date,"PP",lng);
      }

    case ChartType.BOOKING_HOUR_AVG:
    case ChartType.INCOME_AVG:
      switch (timeUnit) {
        case TimeUnit.day:
          const day = Number(value);
          return daysWeek[day]?.dayName || "";
        case TimeUnit.hour:
          const date = new Date();
          // Set the hours and minutes
          const dateWithTime = setMinutes(setHours(date, Number(value)), 0);
          return format(dateWithTime, "hh a");
        case TimeUnit.month:
          return months[Number(value)]?.month || "";
        default:
          return value;
      }
    default:
      return value;
  }
};

export const getTimeUnitOptions = (chartType: ChartType): TimeUnit[] => {
  switch (chartType) {
    case ChartType.BOOKING_HOUR_AVG:
    case ChartType.INCOME_AVG:
      return [TimeUnit.hour, TimeUnit.day, TimeUnit.month];
    case ChartType.BOOKING_HOUR:
    case ChartType.INCOME:
      return [TimeUnit.day, TimeUnit.week, TimeUnit.month, TimeUnit.year];
    default:
      return [];
  }
};
