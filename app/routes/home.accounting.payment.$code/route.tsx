import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { handleError } from "~/util/api/handle-status-code"
import PaymentDetailClient from "./payment.client"


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
        actions:res.data?.actions
    })
}

export default function PaymentDetail(){
    return <PaymentDetailClient/>
}