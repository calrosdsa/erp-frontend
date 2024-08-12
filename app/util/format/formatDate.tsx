

export const formatLongDate = (date:string,locale:string) =>{
    const formattedDate = new Intl.DateTimeFormat(locale, {dateStyle:"long",timeStyle:"medium"}).format(
        new Date(date)
      );
    return formattedDate  
}