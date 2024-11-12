import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClientAdmin from "~/apiclientAdmin"
import RoleTemplateDetailClient from "./role-template-detail.client"

export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClientAdmin({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res= await client.GET("/admin/role-template/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || ""
            }
        }
    })
    console.log(res.data,res.error)
    return json({
        roleTemplate:res.data?.result.entity
    })
}

export default function RoleTemplateDetail(){
    return <RoleTemplateDetailClient/>
}