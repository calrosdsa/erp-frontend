import { z } from "zod";


export const createPaymentSchema = z.object({
    postingDate:z.date(),
    amount:z.coerce.number(),   
    paymentType:z.string(),
    
    partyType:z.string(),
    partyUuid:z.string(),
    partyName:z.string(),
    partyBankAccount:z.string().optional(),
    companyBankAccount:z.string().optional(),
    partyReference:z.number().optional(),

    //UUID
    accountPaidFrom:z.string(),
    accountPaidTo:z.string(),
    accountPaidFromName:z.string(),
    accountPaidToName:z.string()
})