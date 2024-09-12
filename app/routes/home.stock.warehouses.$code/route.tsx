import { json, LoaderFunctionArgs } from "@remix-run/node"
import WareHouseClient from "./warehouse.client"
import apiClient from "~/apiclient"



export const loader = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/stock/warehouse/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || ""
            }
        }
    })
    return json({
        warehouse:res.data?.result.entity,
        actions:res.data?.actions,
    })
}

export default function WareHouse(){
    return <WareHouseClient/>
}