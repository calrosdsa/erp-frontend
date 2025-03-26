import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import ProjectDetailClient from "./project-detail.client"
import { handleError } from "~/util/api/handle-status-code"


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/project/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || ""
            }
        }
    })
    handleError(res.error)
    return json({
        project:res.data?.result.entity,
        activities:res.data?.result.activities,
    })
}

export default function ProjectDetail(){
    return <ProjectDetailClient/>
}