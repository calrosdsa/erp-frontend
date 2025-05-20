import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node"
import apiClient from "~/apiclient"
import { DEFAULT_COLUMN, DEFAULT_CURRENCY, DEFAULT_ORDER, DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { handleError } from "~/util/api/handle-status-code"
import BookingsClient from "./bookings.client"
import { components } from "~/sdk"

type ActionData = {
    action:string
    updateBookingsBatch:components["schemas"]["UpdateBookingBatchRequestBody"]
    validateBookingData:components["schemas"]["ValidateBookingData"]
    createBookingData:components["schemas"]["CreateBookingBody"]
}
export const action = async({request}:ActionFunctionArgs) =>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string| undefined = undefined
    let error:string| undefined = undefined
    let bookingData:components["schemas"]["ValidateBookingData"] | undefined = undefined
    switch(data.action){
        case "validate-booking-data":{
            const res =await client.POST("/regate/booking/validate",{
                body:data.validateBookingData,
            })
            error = res.error?.detail
            bookingData =  res.data?.result 
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
            break
        }
        case "update-bookings-batch":{
            const res = await client.POST("/regate/booking/update-booking-batch",{
                body:data.updateBookingsBatch,
            })
            message = res.data?.message
            error = res.error?.detail
            break
        }
    }
    return json({message,error,bookingData})
}

export const loader = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    if(!params.mode){
        return redirect("./view/list")
    }

        const res = await client.GET("/regate/booking",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
                query:searchParams.get("query") || "",
                event_id:searchParams.get("event_id") || "",
                court_id:searchParams.get("court_id") || "",
                customer_id:searchParams.get("party_id") || "",
                order:searchParams.get("order") || DEFAULT_ORDER,
                column:searchParams.get("column") || DEFAULT_COLUMN,
                status:searchParams.get("status") || ""
            }
        }
    })
    handleError(res.error)
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions
    })
}

export default function Bookings(){
    return <BookingsClient/>
}