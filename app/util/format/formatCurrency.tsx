import { components } from "index";


export const formatCurrency=(input: number | undefined,currency:string,language:string): string =>{
    if (input == undefined) {
      return "";
    }
    // Convert the input string to a number and divide by 100
    const number = input / 100;
    // Format the number to 2 decimal places
    const formatted = new Intl.NumberFormat(language, {
        style: "currency",
        currency: currency,
      }).format(Number(number.toFixed(2)))
    return formatted;
  }


export const formatTax = (tax:components["schemas"]["Tax"],itemPrice:number,currency:string,language:string):string =>{
    return formatCurrency(itemPrice * ((tax.Value)/100),currency,language)
  }

export const formatTotalTax = (tax:components["schemas"]["Tax"],itemPrice:number):number =>{
  return itemPrice * ((tax.Value)/100)
}



  export const getTaxPorcent = (tax:number,itemPrice:number,currency:string,language:string):string =>{
    return formatCurrency(itemPrice * ((tax)/100),currency,language)
  }

