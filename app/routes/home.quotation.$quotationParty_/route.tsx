import { json, LoaderFunctionArgs } from "@remix-run/node";
import QuotationsClient from "./quotation.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";


export const loader = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/quotation/{party}",{
        params:{
            query:{
                page:searchParams.get("page")|| DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
            },
            path:{
                party:params.quotationParty || "",
            }
        }
    })
    console.log(res.error,res.data,params.quotationParty,'12213')
    handleError(res.error)
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions,
    })
}

export default function Quotations(){
    return (
        <div>
            <QuotationsClient/>
        </div>
    )
}