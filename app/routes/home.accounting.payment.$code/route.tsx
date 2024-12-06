    import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { handleError } from "~/util/api/handle-status-code"
import PaymentDetailClient from "./payment.client"
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema"
import { z } from "zod"

type ActionData = {
    action:string
    updateStateWithEvent:z.infer<typeof updateStatusWithEventSchema>
}

export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined= undefined
    let error:string | undefined = undefined
    switch(data.action){
        case "update-state-with-event":{
            const res=  await client.PUT("/payment/update-state",{
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

export const loader = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const res = await client.GET("/payment/detail/{id}",{
        params:{
            path:{
                id:params.code || ""
            }
        }
    })
    handleError(res.error)
    return json({
        paymentData:res.data?.result.entity,
        actions:res.data?.actions,
        associatedActions:res.data?.associated_actions,
        activities:res.data?.result.activities || [],
    })
}

export default function PaymentDetail(){
    return <PaymentDetailClient/>
}