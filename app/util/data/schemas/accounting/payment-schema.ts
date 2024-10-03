import { z } from "zod";


export const createPaymentSchema = z.object({
    postingDate:z.date(),
    amount:z.preprocess((a)=>parseFloat(z.string().parse(a)),z.number()),
    paymentType:z.string(),
    modeOfPayment:z.string(),
    
    partyType:z.string(),
    partyName:z.string().optional(),
    partyUuid:z.string(),
    partyBankAccount:z.string().optional(),
    companyBankAccount:z.string().optional(),
})