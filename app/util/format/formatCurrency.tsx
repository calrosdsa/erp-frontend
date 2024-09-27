import { components } from "~/sdk";


export const formatCurrency=(input: number | undefined,currency:string| undefined,language:string): string =>{
    if (input == undefined) {
      return "";
    }
    if (currency == undefined) {
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

export const sumTotal = (values:number[])=>{
  if(values.length == 0) return 0
  const total = values.reduce((prev,curr)=>prev+curr,0)
  return total  
}



export const formatTax = (tax:components["schemas"]["Tax"],itemPrice:number,currency:string,language:string):string =>{
    return formatCurrency(itemPrice * ((tax.value)/100),currency,language)
  }

export const formatTotalTax = (tax:components["schemas"]["Tax"],itemPrice:number):number =>{
  return itemPrice * ((tax.value)/100)
}




  export const getTaxPorcent = (tax:number,itemPrice:number,currency?:string,language?:string):string =>{
    if(currency == undefined || language == undefined) return "-"
    return formatCurrency(itemPrice * ((tax)/100),currency,language)
  }

