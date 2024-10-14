import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { handleError } from "~/util/api/handle-status-code"
import CourtDetailClient from "./court.client"

export const loader = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res =await client.GET("/court/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || ""
            }
        }
    })
    handleError(res.error)
    return json({
        court:res.data?.result.entity,
        actions:res.data?.actions,
    })
}

export default function CourtDetail(){
    return <CourtDetailClient/>
}