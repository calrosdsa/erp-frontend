import { ActionFunctionArgs, defer, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { handleError } from "~/util/api/handle-status-code"
import { BookingDetailClient } from "./booking.client"
import { z } from "zod"
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema"
import { RegatePartyType, regatePartyTypeToJSON } from "~/gen/common"
import { editPaidAmountSchema } from "~/util/data/schemas/regate/booking-schema"
import { components } from "~/sdk"

type ActionData = {
    action:string
    updateStatus:z.infer<typeof updateStateWithEventSchema>
    editPaidAmount:z.infer<typeof editPaidAmountSchema>
    rescheduleBooking:components["schemas"]["BookingRescheduleBody"]
}

export const action = async({request,params}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data =await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    switch(data.action){
        case "reschedule-booking":{
            const d = data.rescheduleBooking
            const res = await client.PUT("/regate/booking/reschedule",{
                body:d
            })
            message = res.data?.message
            error = res.error?.detail
            break;
        }
        case "edit-paid-amount":{
            const d = data.editPaidAmount
            const res = await client.PUT("/regate/booking/paid-amount",{
                body:{
                    booking_id:d.bookingID,
                    paid_amount:d.paidAmount,
                }
            })
            message = res.data?.message
            error = res.error?.detail
            break;
        }
        case "update-status":{
            const d = data.updateStatus
            const res = await client.PUT("/regate/booking/update-status",{
                body:{
                party_id:d.party_id,
                party_type:d.party_type,
                events:d.events,
                current_state:d.current_state,
            }
        })
        message = res.data?.message
        error = res.error?.detail
        }
    }
    return json({
        error,message,
    })
}


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