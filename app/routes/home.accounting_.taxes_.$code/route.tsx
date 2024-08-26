import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import TaxDetailClient from "./tax.client";
import apiClient from "~/apiclient";



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

    return json({
        tax:res.data?.result
    })
}

export default function TaxDetail (){

    return (
        <TaxDetailClient/>
    )
}