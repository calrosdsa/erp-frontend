import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import PurchaseOrderClient from "./order.client"
import apiClient from "~/apiclient"
import { PartyType } from "~/gen/common"
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema"
import { z } from "zod"

type ActionData = {
    action:string
    updateStatusWithEvent:z.infer<typeof updateStateWithEventSchema>
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined= undefined
    let error:string | undefined = undefined
    switch(data.action){
        case "update-status-with-event":{
            const res=  await client.PUT("/order/update-status",{
                body:data.updateStatusWithEvent
            })
            message = res.data?.message
            error = res.error?.detail
            console.log("ORDER ",res.error)
            break;
        }
    }
    return json({
        message,error
    })
}

export const loader = async ({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    console.log(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/order/detail/{id}",{
        params:{
            path:{
                id:params.code ||  ""
            },
            query:{
                party:PartyType[PartyType.purchaseOrder]
            }
        }
    })
    // res.data?.related_actions
    console.log("PARTY",res.data?.associated_actions[PartyType[PartyType.payment]])
    return json({
        actions:res.data?.actions,
        order:res.data?.result.entity,
        associatedActions:res.data?.associated_actions
    })
}

export default function PurchaseOrder(){
    return <PurchaseOrderClient/>
}