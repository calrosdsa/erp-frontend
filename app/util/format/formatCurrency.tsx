import { components } from "~/sdk";

export const formatAmount = (v?: number): number => {
  if (!v) {
    return 0;
  }
  return Number(v / 100);
};

export const formatAmountToInt = (v?: number): number => {
  if (!v) {
    return 0;
  }
  return Math.round(v * 100);
};

export const  formatCurrency = (
  input: number | undefined,
  currency: string | undefined,
  language: string
): string => {
  if (input == undefined) {
    return "";
  }
  if (currency == undefined || currency == "") {
    return "";
  }
  // Convert the input string to a number and divide by 100
  const number = input / 100;
  // Format the number to 2 decimal places
  const formatted = new Intl.NumberFormat(language, {
    style: "currency",
    currency: currency,
  }).format(Number(number.toFixed(2)));
  return formatted;
};
//For formattiong rate that provide from amount input
export const formatCurrencyAmount = (
  input: number | undefined,
  currency: string | undefined,
  language: string
): string => {
  try{

    if (input == undefined) {
      return "";
  }
  if (currency == undefined) {
    return "";
  }
  // Convert the input string to a number and divide by 100
  // Format the number to 2 decimal places
  const formatted = new Intl.NumberFormat(language, {
    style: "currency",
    currency: currency,
  }).format(Number(input.toFixed(2)));
  return formatted;
}catch(err){
  return ""
}
};

export const sumTotal = (values: number[]) => {
  if (values.length == 0) return 0;
  const total = values.reduce((prev, curr) => prev + curr, 0);
  return total;
};

export const formatTax = (
  tax: components["schemas"]["TaxDto"],
  itemPrice: number,
  currency: string,
  language: string
): string => {
  return formatCurrency(itemPrice * (tax.value / 100), currency, language);
};

export const formatTotalTax = (
  tax: components["schemas"]["TaxDto"],
  itemPrice: number
): number => {
  return itemPrice * (tax.value / 100);
};

export const getTaxPorcent = (
  tax: number,
  itemPrice: number,
  currency?: string,
  language?: string
): string => {
  if (currency == undefined || language == undefined) return "-";
  return formatCurrency(itemPrice * (tax / 100), currency, language);
};
