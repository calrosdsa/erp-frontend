import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { handleError } from "~/util/api/handle-status-code"
import ProjectClient from "./project.client"
import { z } from "zod"
import { createProjectSchema } from "./use-new-project"
import { State, stateToJSON } from "~/gen/common"

type ActionData = {
    action:string
    createProject:z.infer<typeof createProjectSchema>
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    switch(data.action) {
        case "create-project":{
            const d = data.createProject
            const res = await client.POST("/project",{
                body:{
                    name:d.name,
                    status:d.enabled ? stateToJSON(State.ENABLED) :stateToJSON(State.DRAFT),
                }
            })
            console.log(res.error)
            message = res.data?.message
            error = res.error?.detail
            break
        }
    }
    return json({
        message,error
    })
}

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res =await client.GET("/project",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
            }
        }
    })
    handleError(res.error)
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions
    })
}

export default function Project(){
    return <ProjectClient/>
}