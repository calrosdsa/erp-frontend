import { z } from "zod";


export const createCompanySchema = z.object({
    name:z.string(),
    parentId:z.number().optional(),
    parentName:z.string().optional(),
})