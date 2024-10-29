import { ActionFunctionArgs, json } from "@remix-run/node";
import ForgotPasswordClient from "./reset-password.client";
import apiClient from "~/apiclient";
import { z } from "zod";
import { forgotPasswordSchema } from "~/util/data/schemas/auth/forgot-password-schema";


type Data = {
    resetPassword:z.infer<typeof forgotPasswordSchema>
}

export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data =await request.json() as Data
    let error:string | undefined = undefined
    let message:string | undefined =undefined
    const res = await client.POST("/account/reset/password",{
        body:{
            email:data.resetPassword.email
        }
    })
    error = res.error?.detail
    message = res.data?.message
    return json({
        error,message
    })
}

export default function ForgotPassword(){
    
    return <ForgotPasswordClient/>
}