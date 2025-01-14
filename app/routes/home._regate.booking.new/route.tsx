import { ActionFunctionArgs, json, redirect } from "@remix-run/node"
import apiClient from "~/apiclient"
import NewBookingClient from "./new-booking.client"
import { components } from "~/sdk"
import { route } from "~/util/route"


type ActionData = {
    action:string
    validateBookingData:components["schemas"]["ValidateBookingBody"]
    createBookingData:components["schemas"]["CreateBookingBody"]
}

export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    const r =route
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
        case "create-bookings":{
            console.log("CREATE BOOKINGS")
            const res = await client.POST("/regate/booking",{
                body:data.createBookingData
            })
            error = res.error?.detail
            message = res.data?.message
            console.log(res.data?.errors,res.data?.message)
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