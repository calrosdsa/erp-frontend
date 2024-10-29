import { ActionFunctionArgs, json } from "@remix-run/node";
import AccountClient from "./account.client";
import apiClient from "~/apiclient";
import { z } from "zod";
import { updatePasswordSchema } from "~/util/data/schemas/account/account-schema";

type ActionData = {
    action:string
    updatePassword:z.infer<typeof updatePasswordSchema>
}
export const action = async({request}:ActionFunctionArgs) =>{
    const client = apiClient({request})
    const data= await request.json() as ActionData

    let error:string | undefined = undefined
    let message:string | undefined = undefined
    switch(data.action){
        case "update-password":{

            const res = await client.PUT("/account/password",{
                body:{
                    password:data.updatePassword.password,
                    newPassword:data.updatePassword.newPassword,
                }      
            })
            if(res.data){
                message = res.data.message
            }
            if(res.error){
                error = res.error.detail
            }
            break;
        }
    }
    return json({
        message,error
    })
}

export default function Account() {
  return <AccountClient/>;
}
