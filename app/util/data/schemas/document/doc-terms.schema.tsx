import { z } from "zod";
import { components } from "~/sdk";

export type DocTermsType = z.infer<typeof docTermsSchema>

export const docTermsSchema = z.object({
    doc_id:z.number(),
    doc_party_type:z.string(),
    terms_and_conditions_id:z.number().nullable().optional(),
    terms_and_conditions:z.string().nullable().optional(),
    payment_term_template_id:z.number().nullable().optional(),
    payment_term_template:z.string().nullable().optional(),
})

export const mapToDocTermsData  = (e:DocTermsType) =>{
    const d:components["schemas"]["DocTermsData"] = {
        fields: {
            payment_term_template_id:e.payment_term_template_id,
            terms_and_condition_id:e.terms_and_conditions_id,
        },
        doc_id: e.doc_id,
        doc_party_type:e.doc_party_type,
    }
    return d
}