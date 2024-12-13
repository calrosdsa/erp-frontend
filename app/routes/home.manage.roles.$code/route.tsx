import { json, LoaderFunctionArgs } from "@remix-run/node";
import RoleClient from "./role.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE, LOAD_ACTION } from "~/constant";
import { z } from "zod";
import { updateRoleActionsSchema } from "~/util/data/schemas/manage/role-schema";
import { components } from "~/sdk";

type ActionData = {
    action:string
    updateRoleActions:components["schemas"]["EditRolePermissionActionsBody"]
}

export const action = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    let actionRes = LOAD_ACTION
    switch(data.action){
        case "update-role-actions":{
            const res=  await client.POST("/role/permision/actions",{
                body:data.updateRoleActions,
            })
            message = res.data?.message
            error= res.error?.detail
            console.log(res.error)
            break;
        }
    }
    return json({
        message,error,
        actionRoot:actionRes,
    })
}

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/role/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("v") || ""
            }
        }
    })
    
    const roleActions = await client.GET("/role/role-definitions",{
        params:{
            query:{
                parentId:searchParams.get("v") || "",
                page:DEFAULT_PAGE,
                size:"1000",
            }
        }
    })
    const entityActions = await client.GET("/role/entity-actions")
    return json({
        role:res.data?.result.entity,
        actions:res.data?.actions,
        roleActions:roleActions.data?.pagination_result.results || [],
        entityActions:entityActions.data?.result
    })
}

export default function Role(){
    return (
        <RoleClient/>
    )
}