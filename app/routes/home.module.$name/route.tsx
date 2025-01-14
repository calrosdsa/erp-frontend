import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import ModuleDetailClient from "./module-detail.client"
import { mapToModuleData, ModuleDataType } from "~/util/data/schemas/core/module-schema"
import { handleError } from "~/util/api/handle-status-code"

type ActionData=  {
    action:string
    editData:ModuleDataType
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data =await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    switch(data.action) {
        case "edit":{
            const res = await client.PUT("/module",{
                body:mapToModuleData(data.editData)
            })
            message = res.data?.message
            error = res.error?.detail
            handleError(res?.error)
        }
    }

    return json({
        message,
        error,
    })
}

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
    console.log(res.data?.result,res.error)
    return json({
        actions:res.data?.actions,
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