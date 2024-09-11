import { z } from "zod";
import { components } from "~/sdk";


export const currencySchema = z.object({
    code:z.string()
})

export const currencySchemaToCurrencyDto = (d:z.infer<typeof currencySchema>):components["schemas"]["CurrencyDto"]=> {
    return {
        code:d.code
    }
}