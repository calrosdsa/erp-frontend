import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { enUS, es } from "date-fns/locale";


export const formatLongDate = (date:string | undefined | null,locale:string) =>{
  if(typeof date == "undefined" || date == null || date == "" ) return "-"
    const formattedDate = new Intl.DateTimeFormat(locale, {dateStyle:"long",timeStyle:"medium"}).format(
        new Date(date)
      );
    return formattedDate  
}




export const formatMediumDate = (date: string | undefined | null, locale: string) => {
  if (typeof date === "undefined" || date == null || date == "") return "-";
  const formattedDate = new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(date)
  );
  return formattedDate;
};

type FormatStr = "PP"
export const formatDateUTC = (date:Date,formatStr:FormatStr,lang:string):string =>{
  let locale  = es
  switch(lang){
    case "en":
      locale = enUS
      break
  }
  return format(toZonedTime(date, "UTC"), formatStr,{locale:locale});
}