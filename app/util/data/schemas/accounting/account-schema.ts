import { z } from "zod";


export const createAccountLedger = z.object({
    name:z.string(),
    description:z.string().optional(),
    isGroup:z.boolean(),
    enabled:z.boolean(),
    accountType:z.string(),
    parentName:z.string().optional(),
    parentUuid:z.string().optional(),
    ledgerNo:z.string().optional(),

})