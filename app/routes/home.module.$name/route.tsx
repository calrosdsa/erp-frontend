import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import ModuleDetailClient from "./module-detail.client"


export const  loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/module/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || "",
            }
        }
    })
    // console.log(res.data?.result,res.error)
    return json({
        action:res.data?.actions,
        module:res.data?.result.entity.module,
        sections:res.data?.result.entity.sections,
        activities:res.data?.result.activities,
    })
}

export default function ModuleDetail(){
    return(
        <ModuleDetailClient/>
    )
}