import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import TaxDetailClient from "./tax.client";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";



export const loader = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/accounting/tax/{id}",{
        params:{
            path:{
               id:searchParams.get("id") || ""
            }
        }
    })
    handleError(res.error)
    return json({
        tax:res.data?.result.entity,
        actions:res.data?.actions
    })
}

export default function TaxDetail (){

    return (
        <TaxDetailClient/>
    )
}