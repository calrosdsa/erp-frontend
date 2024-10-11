import { z } from "zod";


export const updateStateWithEventSchema = z.object({
    party_id:z.string(),
    party_type:z.string(),
    events:z.array(z.number()),
    current_state:z.string(),
})


export const validateStringNumber = (val:string,ctx:z.RefinementCtx):number | Promise<number>  =>{
    const parsed = parseFloat(val)
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params:{
          i18n:{key:"custom.not_a_number"}
      },
      });
  
      return z.NEVER;
    }
    return parsed;
  }
  


export const validateNumber = (val:number,ctx:z.RefinementCtx):number | Promise<number>  =>{
    if (isNaN(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params:{
          i18n:{key:"custom.not_a_number"}
      },
      });
  
      return z.NEVER;
    }
    return val;
  }
    