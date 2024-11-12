import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClientAdmin from "~/apiclientAdmin"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import RoleTemplateClient from "./role-template.client"
import { z } from "zod"
import { createRoleTemplateSchema } from "./use-new-role-template"

type ActionData = {
    action:string
    createRoleTemplate:z.infer<typeof createRoleTemplateSchema>
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClientAdmin({request})
    const data =await request.json() as ActionData
    let error:string | undefined = undefined
    let message:string | undefined = undefined
    switch(data.action){
        case "create-role-template":{
            const d = data.createRoleTemplate
            const res = await client.POST("/admin/role-template",{
                body:{
                    name:d.name
                }
            })
            error = res.error?.detail
            message = res.data?.message
            break;
        }
    }
    return json({
        error,message
    })
}

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClientAdmin({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/admin/role-template",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
            }
        }
    })

    return json({
        paginationResult:res.data?.pagination_result,
    })
}

export default function RoleTemplate(){
    return (
        <RoleTemplateClient/>
    )
}