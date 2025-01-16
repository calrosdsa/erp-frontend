import { z } from "zod";
import { components } from "~/sdk";

export type PaymentTermsType = z.infer<typeof paymentTermsDataSchema>

export const paymentTermsDataSchema = z.object({
    id:z.number().optional(),
    name:z.string(),
    invoice_portion:z.coerce.number(),
    credit_days:z.coerce.number().nullable().optional(),
    due_date_base_on:z.string(),
    description:z.string().nullable().optional(),
    discount_type:z.string().nullable().optional(),
    discount:z.coerce.number().nullable().optional(),
    discount_validity_base_on:z.string().nullable().optional(),
    discount_validity:z.coerce.number().nullable().optional(),

})


export const mapToPaymentTermsData = (
    e:PaymentTermsType
):components["schemas"]["PaymentTermsData"] =>{
    const d:components["schemas"]["PaymentTermsData"] = {
        id:e.id,
        filds: {
            name: e.name,
            invoice_portion:e.invoice_portion,
            credit_days:e.credit_days || null,
            due_date_base_on:e.due_date_base_on,
            description:e.description || null,
            discount_type:e.discount_type || null,
            discount:e.discount || null,
            discount_validity_base_on:e.discount_validity_base_on || null,
            discount_validity:e.discount_validity || null
        }
    }
    return d
}

