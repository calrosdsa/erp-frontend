import { ActionFunctionArgs, json } from "@remix-run/node";
import PaymentCreateClient from "./create-payment.client";
import apiClient from "~/apiclient";
import { z } from "zod";
import { createPaymentSchema } from "~/util/data/schemas/accounting/payment-schema";
import { components } from "~/sdk";

type ActionData = {
    action:string
    createPayment:z.infer<typeof createPaymentSchema>
}

export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let error:string | undefined = undefined
    let message:string |  undefined = undefined
    let payment:components["schemas"]["PaymentDto"] | undefined = undefined
    switch(data.action){
        case "payment-parties":{
            break;
        }
        case "create-payment":{
            const d = data.createPayment
            const res = await client.POST("/payment",{
                body:{
                    payment:{
                        amount:d.amount,
                        mode_of_payment:d.modeOfPayment,
                        payment_type:d.paymentType,
                        postuing_date:d.postingDate.toString(),
                    },
                    payment_party:{
                        party_uuid:d.partyUuid,
                        party_bank_account:d.partyBankAccount,
                        company_bank_account:d.companyBankAccount,
                    }
                }
            })
            error = res.error?.detail
            message = res.data?.message
            payment = res.data?.result
            break
        }
    }
    return json({
        error,message,payment
    })
}

export default function CreatePayment(){
    return (
        <PaymentCreateClient/>
    )
}