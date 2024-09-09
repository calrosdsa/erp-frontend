

export const formatLongDate = (date:string | undefined,locale:string) =>{
  if(typeof date == "undefined") return "-"
    const formattedDate = new Intl.DateTimeFormat(locale, {dateStyle:"long",timeStyle:"medium"}).format(
        new Date(date)
      );
    return formattedDate  
}