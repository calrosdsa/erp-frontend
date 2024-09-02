import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { components } from "index"
import { getSession } from "~/sessions"
import ProfileClient from "./profile.client"
import { Role } from "~/types/enums"
import { z } from "zod"
import { updateClientSchema } from "~/util/data/schemas/client/client-schema"


type ActionData = {
    action:string
    updateClient:z.infer<typeof updateClientSchema>
}
export const action = async({request}:ActionFunctionArgs) =>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let error:string | undefined = undefined
    let message:string | undefined = undefined
    switch(data.action){
        case "update-client":{
            const d = data.updateClient
            const res = await client.PUT("/client",{
                body:{
                    givenName:d.givenName,
                    familyName:d.familyName,
                    organizationName:d.organizationName,
                    phoneNumber:{
                        number:d.phoneNumber,
                        countryCode:d.countryCode,
                    }
                }
            })
            console.log("UPDATE CLIENT ACTION",res.error)
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
        error,message
    })
}

export const loader = async({request}:LoaderFunctionArgs) =>{
    const clientR = apiClient({request})
    const session = await getSession(
        request.headers.get("Cookie")
    );
    const role = session.get("role")
    let client:components["schemas"]["Client"]| undefined = undefined
    switch(role){
        case Role.ROLE_CLIENT:{
            const res = await clientR.GET("/client")
            console.log("CLIENT PROFILE",res.data,res.error)
            if(res.data){
                client = res.data.result
            }
            break;
        }
    }
    return json({
        client,
    })
}

export default function  Profile(){
    return (
        <div>
            <ProfileClient/>
        </div>
    )
}