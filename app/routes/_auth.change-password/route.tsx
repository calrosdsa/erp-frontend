import { z } from "zod";
import ChangePasswordClient from "./change-password.client";
import { changePasswordSchema } from "~/util/data/schemas/auth/forgot-password-schema";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";

type Data = {
    changePassword:z.infer<typeof changePasswordSchema>

}

export const action = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const data= await request.json() as Data
    const url = new URL(request.url)
    const searchParams = url.searchParams
    let error:string | undefined =undefined 
    let message:string | undefined = undefined
    const res = await client.POST("/account/change/password",{
        body:{
            password:data.changePassword.newPassword,
            token:searchParams.get("c") || ""
        }
    })
    console.log(res.error,res.data)
    error = res.error?.detail
    message = res.data?.message
    return json({
        error,message
    })
}

export default function ChangePassword(){
    return (
        <ChangePasswordClient/>
    )
}