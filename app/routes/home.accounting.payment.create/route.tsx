import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
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
    let partiesType:components["schemas"]["PartyTypeDto"][] = []
    switch(data.action){
        case "payment-parties":{
            const res = await client.GET("/payment/parties")
            partiesType = res.data?.result || []
            console.log("payment parties type",res.error)
            break;
        }
        case "create-payment":{
            const d = data.createPayment
            const res = await client.POST("/payment",{
                body:{
                    payment:{
                        amount:d.amount,
                        payment_type:d.paymentType,
                        postuing_date:d.postingDate.toString(),
                    },
                    payment_party:{
                        party_uuid:d.partyUuid,
                        party_type:d.partyType,
                        party_bank_account:d.partyBankAccount,
                        company_bank_account:d.companyBankAccount,
                        party_reference:d.partyReference
                    },
                    payment_accounts:{
                        paid_from_id:d.accountPaidFrom,
                        paid_to_id:d.accountPaidTo,
                    }
                }
            })
            error = res.error?.detail
            message = res.data?.message
            payment = res.data?.result
            console.log(res.error,res.data)
            break
        }
    }
    return json({
        error,message,payment,partiesType
    })
}

export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const res =await client.GET("/payment/associated-actions")
    return json({
        associatedActions:res.data?.associated_actions
    })
}

export default function CreatePayment(){
    return (
        <PaymentCreateClient/>
    )
}