import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import CompanyClient from "./company.client"


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/company/detail/{id}",{
        params:{
            path:{
                id:params.code || ""
            }
        }
    })
    console.log(res.error)
    return json({
        company:res.data?.result
    })
}

export default function Company(){
    return (
        <CompanyClient/>
    )
}