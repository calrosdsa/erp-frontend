import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { DEFAULT_COLUMN, DEFAULT_ORDER, DEFAULT_SIZE } from "~/constant"
import { handleError } from "~/util/api/handle-status-code"
import { components, operations } from "~/sdk"
import CashOutflowClient from "./cash-outflow.client"

type ActionData ={
    action:string
    query:operations["cash-outflow"]["parameters"]["query"]
}

export const action = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const data =await request.json()as ActionData
    let results:components["schemas"]["CashOutflowDto"][] = []
    let actions:components["schemas"]["ActionDto"][] = []
    switch(data.action){
        case "get":{
            const res = await client.GET("/cash-outflow",{
                params:{
                    query:data.query
                }
            })
            results = res.data?.result || []
            actions = res.data?.actions || []
            break;
        }
    }
    return json({
        results,
        actions
    })
}

export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/cash-outflow",{
        params:{
            query:{
                size:searchParams.get("size") || DEFAULT_SIZE,
                status:searchParams.get("status") || undefined,
                code:searchParams.get("code") || undefined,
                column:searchParams.get("column") || DEFAULT_COLUMN,
                orientation: searchParams.get("orientation") || DEFAULT_ORDER,
                created_at: searchParams.get("created_at") || "",
                update_at: searchParams.get("update_at") || "",
            }
        }
    })
    handleError(res.error)
    return json({
        results:res.data?.result,
        actions:res.data?.actions,
        filters:res.data?.filters
    })
}

export default function CashOutflow(){
    return (
        <CashOutflowClient/>
    )
}