import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { handleError } from "~/util/api/handle-status-code"
import ReceiptDetailClient from "./receipt.client"
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema"
import { z } from "zod"


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
            const res=  await client.PUT("/receipt/update-state",{
                body:data.updateStateWithEvent
            })
            message = res.data?.message
            error = res.error?.detail
            console.log(res.error)
            break;
        }
    }
    return json({
        message,error
    })
}

export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
     const url = new URL(request.url)
     const searchParams = url.searchParams
     const res = await client.GET("/receipt/detail/{id}",{
        params:{
            path:{
                id:params.code || "",
            },
            query:{
                party:params.partyReceipt || "",
            }
        }
     })
     handleError(res.error)

    return json({
        receiptDetail:res.data?.result.entity,
        actions:res.data?.actions
    })
}

export default function ReceiptDetail(){

    return (

        <ReceiptDetailClient/>
    )
}