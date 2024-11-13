import { json, LoaderFunctionArgs } from "@remix-run/node";
import ReceiptsClient from "./receipts.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";


export const loader = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/receipt/{party}",{
        params:{
            query:{
                page:searchParams.get("page")|| DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
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
    })
}

export default function Receipts(){
    return (
        <div>
            <ReceiptsClient/>
        </div>
    )
}