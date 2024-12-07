import { z } from "zod";

export const createCurrencyExchangeSchema = z.object({
    name:z.string(),
    fromCurrency:z.string(),
    toCurrency:z.string(),
    exchangeRate:z.coerce.number(),
    forBuying:z.boolean(),
    forSelling:z.boolean(),
})

export const editCurrencyExchangeSchema = z.object({
    id:z.number(),
    name:z.string(),
    fromCurrency:z.string(),
    toCurrency:z.string(),
    exchangeRate:z.coerce.number(),
    forBuying:z.boolean(),
    forSelling:z.boolean(),
})