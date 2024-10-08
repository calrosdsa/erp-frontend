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

export const action = async({request}:ActionFunctionArgs)=>{
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
                    currency:d.currency.code,
                    posting_date:d.postingDate.toString(),
                    party_uuid:d.partyUuid,
                    party_type:d.partyType,
                    lines:lines,
                    accepted_warehouse:d.acceptedWarehouse,
                    rejected_warehouse:d.rejectedWarehouse,
                }
            })
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