import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { DEFAULT_SIZE } from "~/constant"
import ModulesClient from "./modules.client"


export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res  = await client.GET("/module",{
        params:{
            query:{
                size:searchParams.get("size") || DEFAULT_SIZE,
            }
        }
    })

    return json({
        results :res.data?.result,
        actions:res.data?.actions,
    })
}

export default function Module(){
    return (
       <ModulesClient/>
    )
}