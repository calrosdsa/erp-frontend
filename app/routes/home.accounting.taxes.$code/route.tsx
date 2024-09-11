import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import TaxDetailClient from "./tax.client";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";



export const loader = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const code = params.code
    const res = await client.GET("/accounting/tax/{id}",{
        params:{
            path:{
               id:code || ""
            }
        }
    })
    handleError(res.error)
    console.log(res.error)
    return json({
        tax:res.data?.result.entity
    })
}

export default function TaxDetail (){

    return (
        <TaxDetailClient/>
    )
}