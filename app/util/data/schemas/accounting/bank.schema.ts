import { z } from "zod";
import { components } from "~/sdk";

export type BankDataType = z.infer<typeof bankDataSchema>

export const bankDataSchema = z.object({
    id:z.number().optional(),
    name:z.string(),
})

export const mapToBankData = (t:BankDataType)=>{
    const d:components["schemas"]["BankData"] = {
        fields: {
            name: t.name
        },
        id: t.id || 0,
    }
    return d
}