import { json, LoaderFunctionArgs } from "@remix-run/node";
import RoleClient from "./role.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";


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