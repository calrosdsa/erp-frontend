import { json, LoaderFunctionArgs } from "@remix-run/node";
import UserClient from "./user.client";
import apiClient from "~/apiclient";

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParamas = url.searchParams
    const res = await client.GET("/user/profile/detail/${id}",{
        params:{
            path:{
                id:searchParamas.get("v") || ""
            }
        }
    })
    console.log("ERROR",res.error)
    return json({
        profile:res.data?.result.entity,
        actions:res.data?.actions,
    })
}

export default function User(){
    return <UserClient/>
}