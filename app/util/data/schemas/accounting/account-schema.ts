import { z } from "zod";


export const createAccountLedger = z.object({
    name:z.string(),
    description:z.string().optional(),
    isGroup:z.boolean().default(false),
    enabled:z.boolean().default(true),
    accountType:z.string().optional(),
    accountRootType:z.string(),
    reportType:z.string().optional(),
    cashFlowSection:z.string().optional(),
    parentName:z.string().optional(),
    parentUuid:z.string().optional(),
    ledgerNo:z.string().optional(),
    
    currency:z.string().optional(),
    currencyName:z.string().optional(),
})
// .superRefine((val,ctx)=>{
//     if(val.isGroup == false && !val.currency){
//         ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: `No duplicates allowed.`,
//             path:['currencyName']
//         })
//     }
// })
.refine((data)=>{
    if (data.isGroup === false && !data.currency) {
        return false; // Validation fails if optionalField is not provided
      }
      return true; // Validation passes otherwise
}, {
    message: "The currency field is required when the account group option is disabled.",
    path: ['currencyName'], // Set the path to the field that should show the error
})