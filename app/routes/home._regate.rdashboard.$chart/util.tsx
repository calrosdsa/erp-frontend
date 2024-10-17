import { ChartType, chartTypeToJSON, TimeUnit } from "~/gen/common";
import { daysWeek } from "~/util/data/day-weeks";

export const getChartName = (chart:ChartType,timeUnit:TimeUnit,value:string,lng:string):string=> {
    switch (chart) {
        case ChartType.INCOME:
          const date = new Date(value);
          return date.toLocaleDateString(lng, {
            month: "short",
            day: "numeric",
          });
        case ChartType.INCOME_AVG:
            switch(timeUnit){
                case TimeUnit.day:
                    const day = Number(value)
                    return daysWeek[day]?.dayName || ""
                default:
                    return value
            }
        default:
            return value  
      }
}