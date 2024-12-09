import { z } from "zod";


export const createAccountLedger = z.object({
    name:z.string(),
    isGroup:z.boolean(),
    accountType:z.string().optional(),
    accountRootType:z.string(),
    reportType:z.string().optional(),
    cashFlowSection:z.string().optional(),
    parent:z.string().optional(),
    parentID:z.number().optional(),
    ledgerNo:z.string().optional(),
    
    // currency:z.string().optional(),
    // currencyName:z.string().optional(),
})

export const editAccountLedger = z.object({
    id:z.number(),
    name:z.string(),
    isGroup:z.boolean(),
    accountType:z.string().optional(),
    accountRootType:z.string(),
    reportType:z.string().optional(),
    cashFlowSection:z.string().optional(),
    parent:z.string().optional(),
    parentID:z.number().optional(),
    ledgerNo:z.string().optional().nullable(),
})