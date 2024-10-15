import { ActionFunctionArgs, json } from "@remix-run/node"
import apiClient from "~/apiclient"
import NewBookingClient from "./new-booking.client"
import { components } from "~/sdk"


type ActionData = {
    action:string
    validateBookingData:components["schemas"]["ValidateBookingBody"]
}

export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    let bookingData:components["schemas"]["BookingData"][] = []
    switch(data.action){
        case "validate-booking-data":{
            const res =await client.POST("/regate/booking/validate",{
                body:data.validateBookingData,
            })
            error = res.error?.detail
            bookingData =  res.data?.result || []
            console.log(res.error,res.data)
            break;
        }
    }
    return json({
        message,error,bookingData
    })
}

export default function NewBooking(){
    return (
        <NewBookingClient/>
    )
}