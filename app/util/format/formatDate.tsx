

export const formatLongDate = (date:string | undefined,locale:string) =>{
  if(typeof date == "undefined") return "-"
    const formattedDate = new Intl.DateTimeFormat(locale, {dateStyle:"long",timeStyle:"medium"}).format(
        new Date(date)
      );
    return formattedDate  
}



export const formatMediumDate = (date: string | undefined | null, locale: string) => {
  if (typeof date === "undefined" || date == null) return "-";
  const formattedDate = new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(date)
  );
  return formattedDate;
};