import { json, LoaderFunctionArgs } from "@remix-run/node";
import ReceiptsClient from "./receipts.client";
import apiClient from "~/apiclient";
import { DEFAULT_COLUMN, DEFAULT_ORDER, DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";


export const loader = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/receipt/{party}",{
        params:{
            query:{
                page: searchParams.get("page") || DEFAULT_PAGE,
                size: searchParams.get("size") || DEFAULT_SIZE,
                query: searchParams.get("query") || "",
                order: searchParams.get("order") || DEFAULT_ORDER,
                column: searchParams.get("column") || DEFAULT_COLUMN,
                status: searchParams.get("status") || "",
                posting_date: searchParams.get("posting_date") || "",
                party_id: searchParams.get("party") || "",
            },
            path:{
                party:params.partyReceipt || "",
            }
        }
    })
    console.log(res.error,res.data)
    handleError(res.error)
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions,
        filters:res.data?.pagination_result.filters,
    })
}

export default function Receipts(){
    return (
        <div>
            <ReceiptsClient/>
        </div>
    )
}