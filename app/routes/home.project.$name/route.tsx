import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import ProjectDetailClient from "./project-detail.client"
import { handleError } from "~/util/api/handle-status-code"


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/project/detail/{id}",{
        params:{
            path:{
                id:params.name || ""
            }
        }
    })
    handleError(res.error)
    return json({
        project:res.data?.result.entity
    })
}

export default function ProjectDetail(){
    return <ProjectDetailClient/>
}