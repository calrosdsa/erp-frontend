import { z } from "zod";


export const createPaymentSchema = z.object({
    postingDate:z.date(),
    amount:z.preprocess((a)=>parseFloat(z.string().parse(a)),z.number()),
    paymentType:z.string(),
    modeOfPayment:z.string(),
    
    partyType:z.string(),
    partyUuid:z.string(),
    partyBankAccount:z.string().optional(),
    companyBankAccount:z.string().optional(),

    //UUID
    accountPaidFrom:z.string(),
    accountPaidTo:z.string(),
    accountPaidFromName:z.string(),
    accountPaidToName:z.string()
})