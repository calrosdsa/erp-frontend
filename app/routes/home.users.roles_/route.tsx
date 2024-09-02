import { json, LoaderFunctionArgs } from "@remix-run/node";
import RolesClient from "./roles.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";


export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const params = url.searchParams
    const res=  await client.GET("/role",{
        params:{
            query:{
                page:params.get("page") || DEFAULT_PAGE,
                size:params.get("size") || DEFAULT_SIZE,
                query:params.get("query") || "",
            }
        }
    })
    return json({
        data:res.data
    })
}

export default function Roles(){

    return <RolesClient/>
}