import { z } from "zod";
import { components } from "~/sdk";


export type PaymentTermsTemplateType = z.infer<typeof paymentTermsTemplateDataSchema>
export type PaymentTermsLineType = z.infer<typeof paymentTermsLineDataSchema>

export const paymentTermsLineDataSchema = z.object({
    payment_term_id:z.number(),
    payment_term:z.string(),
    invoice_portion:z.coerce.number(),
    credit_days:z.coerce.number().nullable(),
    due_date_base_on:z.string(),
    description:z.string().nullable(),
})

export const paymentTermsTemplateDataSchema = z.object({
    id:z.number().optional(),
    name:z.string(),
    payment_term_lines:z.array(paymentTermsLineDataSchema),
})

export const mapToPaymentTermsLineData = (e:PaymentTermsLineType) =>{
    const d:components["schemas"]["PaymentTermsLineData"] = {
        credit_days: e.credit_days,
        description: e.description,
        due_date_base_on: e.due_date_base_on,
        invoice_portion: e.invoice_portion,
        payment_terms_id: e.payment_term_id
    }
    return d
}

export const mapToPaymentTermsLineSchema = (e:components["schemas"]["PaymentTermsLineDto"]) =>{
    const d:PaymentTermsLineType = {
        credit_days: e.credit_days,
        description: e.description,
        due_date_base_on: e.due_date_base_on,
        invoice_portion: e.invoice_portion,
        payment_term_id: e.payment_term_id,
        payment_term: e.payment_term,
    }
    
    return d
}


export const mapToPaymentTermsTemplateData = (e:PaymentTermsTemplateType) =>{
    const d:components["schemas"]["PaymentTermsTemplateData"] = {
        id:e.id,
        filds: {
            name: e.name
        },
        lines: e.payment_term_lines.map(t=>mapToPaymentTermsLineData(t))
    }
    return d
}