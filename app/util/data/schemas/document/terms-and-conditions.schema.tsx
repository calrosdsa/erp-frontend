import { z } from "zod";
import { components } from "~/sdk";

export type TermsAndCondtionsDataType = z.infer<typeof termsAndConditionsDataSchema>

export const termsAndConditionsDataSchema = z.object({
    id:z.number().optional(),
    name:z.string(),
    terms_and_conditions:z.string(),
})


export const mapToTermsAndConditionsData = (
    e:TermsAndCondtionsDataType
):components["schemas"]["TermsAndConditionsData"] =>{
    const d:components["schemas"]["TermsAndConditionsData"] = {
        id:e.id,
        filds: {
            name: e.name,
            terms_and_conditions: e.terms_and_conditions,
        }
    }
    return d
}

