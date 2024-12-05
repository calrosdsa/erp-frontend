import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";


export const createCommentSchema = z.object({
    comment:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH).superRefine((data,ctx)=>{
       if(data == "") {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params:{
                i18n:{key:"custom.required"}
            },
            path:["comment"]
          });
       }
    }),
    partyID:z.number(),
})

export const editCommentSchema = z.object({
    comment:z.string().max(DEFAULT_MAX_LENGTH),
    id:z.number(),
})