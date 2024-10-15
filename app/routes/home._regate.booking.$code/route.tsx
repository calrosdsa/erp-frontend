import { defer, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { handleError } from "~/util/api/handle-status-code"
import { BookingDetailClient } from "./booking.client"

export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/regate/booking/detail/{id}",{
        params:{
            path:{
                id:params.code || ""
            }
        }
    })
    handleError(res.error)
    return defer({
        booking:res.data?.result.entity,
        actions:res.data?.actions,
        activities:res.data?.result.activities,
    })
}

export default function BookingDetail(){
    return (
        <div>
            <BookingDetailClient/>
        </div>
    )
}