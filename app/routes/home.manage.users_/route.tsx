import UsersClient from "./users.client";

import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import { z } from "zod";
import apiClient from "~/apiclient"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { components } from "~/sdk";
import { createUserSchema } from "~/util/data/schemas/manage/user-schema";

type ActionData = {
    action:string
    createUser:z.infer<typeof createUserSchema>
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data= await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    let partyTypes:components["schemas"]["PartyType"][] = []
    switch(data.action){
        case "create-user":{
            const d = data.createUser
            const res = await client.POST("/user/profile",{
                body:{
                    roleId:d.roleId,
                    email:d.email,
                    givenName:d.givenName,
                    familyName:d.familyName,
                    phoneNumber:d.phoneNumber,
                    companyIds:d.companyIds,
                    partyCode:d.partyCode,
                    keyValue:d.keyValue
                }
            })
            message = res.data?.message
            error = res.error?.detail
            break
        }
        case "party-types":{
            console.log("GETTING PARTY USERS")
            const res = await client.GET("/party/type/users")
            partyTypes = res.data?.result.entity || []
            break;
        }
    }

    return json({
        message,error,partyTypes
    })
}

export const loader = async({request}:LoaderFunctionArgs) => {
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res=  await client.GET("/user/profile",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
                query:searchParams.get("query") || "",
            }
        }
    })
    console.log(res.error)
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions,
    })
}


export default function Users(){

    return <UsersClient/>
}