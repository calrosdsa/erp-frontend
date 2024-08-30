import { json, LoaderFunctionArgs } from "@remix-run/node"
import WareHouseClient from "./warehouse.client"
import apiClient from "~/apiclient"



export const loader = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const res = await client.GET("/stock/warehouse/detail/{id}",{
        params:{
            path:{
                id:params.code || ""
            }
        }
    })
    return json({
        warehouse:res.data?.result
    })
}

export default function WareHouse(){
    return <WareHouseClient/>
}