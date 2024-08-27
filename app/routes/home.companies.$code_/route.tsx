import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import CompanyClient from "./company.client"


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/company/{id}",{
        params:{
            path:{
                id:params.code || ""
            }
        }
    })
    return json({
        company:res.data?.result
    })
}

export default function Company(){
    return (
        <CompanyClient/>
    )
}