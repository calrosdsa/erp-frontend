import { json, LoaderFunctionArgs } from "@remix-run/node"
import CustomerClient from "./customer.client"
import apiClient from "~/apiclient"


export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/customer/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || ""
            }
        }
    })
    console.log(res.error,res.data)
    return json({
        customer:res.data?.result.entity,
        actions:res.data?.actions
    })
}

export default function Customer(){
    return <CustomerClient/>
}