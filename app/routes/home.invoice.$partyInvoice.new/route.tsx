import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import CreatePurchaseInvoiceClient from "./create-invoice.client"
import { z } from "zod"
import { createPurchaseInvoiceSchema } from "~/util/data/schemas/invoice/invoice-schema"
import { orderLineSchemaToOrderLineDto } from "~/util/data/schemas/buying/purchase-schema"
import { currencySchemaToCurrencyDto } from "~/util/data/schemas/app/currency-schema"
import { components } from "~/sdk"
import { PartyType } from "~/gen/common"

type ActionData ={
    action:string
    createPurchaseInvoice:z.infer<typeof createPurchaseInvoiceSchema>
}

export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let error:string | undefined = undefined
    let message:string | undefined = undefined
    let invoice:components["schemas"]["InvoiceDto"]| undefined = undefined
    switch(data.action){
        case "create-invoice":{
            const d = data.createPurchaseInvoice
            const lines = d.lines.map(t=>orderLineSchemaToOrderLineDto(t))
            const res = await client.POST("/invoice",{
                body:{
                    invoice:{
                        party_uuid:d.partyUuid,
                        party_type:d.partyType,
                        invoice_party_type:PartyType[PartyType.purchaseInvoice],
                        due_date:d.due_date?.toString(),
                        date:d.date.toString(),
                        currency:d.currency.code,
                        reference:d.referenceID,
                    },
                    items:{
                        lines:lines,
                    },
                }
            })
            error = res.error?.detail
            message = res.data?.message
            invoice = res.data?.result
            break;
        }
    }
    return json({
        error,message,invoice
    })
}

export default function CreatePurchaseInvoice(){
    return (
        <CreatePurchaseInvoiceClient/>
    )
}