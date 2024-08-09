export const formatNumber=(input: number | undefined): string =>{
    if (input == undefined) {
      return "";
    }
    // Convert the input string to a number and divide by 100
    const number = input / 100;
    // Format the number to 2 decimal places
    return number.toFixed(2);
  }


export const getTax = (taxRate:number,itemPrice:number):string =>{
    return formatNumber(itemPrice * ((taxRate)/100))
  }
