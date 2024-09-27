import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { handleError } from "~/util/api/handle-status-code"
import PurchaseInvoicesClient from "./purchase-invoice.client"


export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/invoice",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
            }
        }
    })
    handleError(res.error)
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions,
    })
}

export default function PurchaseInvoices(){
    return <PurchaseInvoicesClient/>
}