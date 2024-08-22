import { z } from "zod";


export const pluginObjectSchema =  z.object({
    plugin:z.string(),
    companyId:z.number().optional()
})