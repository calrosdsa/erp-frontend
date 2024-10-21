import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { DEFAULT_COLUMN, DEFAULT_CURRENCY, DEFAULT_ORDER, DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { handleError } from "~/util/api/handle-status-code"
import BookingsClient from "./bookings.client"


export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/regate/booking",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
                query:searchParams.get("query") || "",
                event_id:searchParams.get("event") || "",
                court_id:searchParams.get("court") || "",
                customer_id:searchParams.get("customer") || "",
                order:searchParams.get("order") || DEFAULT_ORDER,
                column:searchParams.get("column") || DEFAULT_COLUMN,
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