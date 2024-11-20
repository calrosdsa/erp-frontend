import { z } from "zod";
import NewReceiptClient from "./new-receipt.client";
import { createReceiptSchema } from "~/util/data/schemas/receipt/receipt-schema";
import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { orderLineSchemaToOrderLineDto } from "~/util/data/schemas/buying/purchase-schema";

type ActionData = {
    action:string
    createReceipt:z.infer<typeof createReceiptSchema>
}

export const action = async({request,params}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    let receipt:components["schemas"]["ReceiptDto"] | undefined = undefined
    switch(data.action){
        case "create-receipt":{
            const d = data.createReceipt
            const lines = d.lines.map(t=>orderLineSchemaToOrderLineDto(t))
            const res =await client.POST("/receipt",{
                body:{
                    receipt:{
                        posting_date:d.postingDate.toString(),
                        currency:d.currency,
                        party_receipt:params.partyReceipt || "",

                        party_uuid:d.partyUuid,
                        party_type:d.partyType,
                        reference:d.reference,
                    },
                    items:{
                        lines: lines,
                    }
                }
            })
            console.log(res.error,res.data)
            message = res.data?.message
            error=res.error?.detail
            receipt = res.data?.result
            break
        }
    }
    return json({
        message,error,receipt
    })
}

export default function NewReceipt(){
    return <NewReceiptClient/>
}