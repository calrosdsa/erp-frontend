import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { PartyType } from "~/gen/common"
import { handleError } from "~/util/api/handle-status-code"
import PurchaseInvoiceDetailClient from "./invoice.client"
import { z } from "zod"
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema"
type ActionData = {
    action:string
    updateStateWithEvent:z.infer<typeof updateStateWithEventSchema>
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined= undefined
    let error:string | undefined = undefined
    switch(data.action){
        case "update-state-with-event":{
            const res=  await client.PUT("/invoice/update-state",{
                body:data.updateStateWithEvent
            })
            message = res.data?.message
            error = res.error?.detail
            break;
        }
    }
    return json({
        message,error
    })
}

export const loader =  async({request}:LoaderFunctionArgs)=>{
    const  client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/invoice/purchase/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || ""
            },
            query:{
                party:PartyType[PartyType.purchaseInvoice],
            }
        }

    })
    handleError(res.error)
    return json({
        invoiceDetail:res.data?.result.entity,
        actions:res.data?.actions,
    })
}
export default function InvoiceDetail(){
    return (
        <div>
            <PurchaseInvoiceDetailClient/>
        </div>
    )
}