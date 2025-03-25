import { json, LoaderFunctionArgs } from "@remix-run/node";
import UserClient from "./user.client";
import apiClient from "~/apiclient";

export const loader = async({request,params}:LoaderFunctionArgs) =>{
    console.log("LOAD DATA",)
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParamas = url.searchParams
    const res = await client.GET("/profile/detail/${id}",{
        params:{
            path:{
                id:params.id || ""
            }
        }
    })  
    return json({
        profile:res.data?.result.entity,
        actions:res.data?.actions,
    })
}

export default function User(){
    return <UserClient/>
}

export const openUserModal = (id:any,callback:(key:string,value:string)=>void)=>{
    if(!id) return
    callback("user_m",id)
}