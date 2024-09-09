import { ActionFunctionArgs, json } from "@remix-run/node"
import { z } from "zod"
import apiClient from "~/apiclient"
import { DEFAULT_ENABLED, DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { components } from "~/sdk"
import { PartyType } from "~/types/enums"
import { createGroupSchema } from "~/util/data/schemas/group-schema"

type ActionData = {
    action:string
    createGroup:z.infer<typeof createGroupSchema>
    query:string
    partyType:string
}

export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    let groups:components["schemas"]["GroupDto"][] =[]
    let actions:components["schemas"]["Action"][] =[]
    switch(data.action){
        case "get":{
            const res= await client.GET("/group/{group}",{
                params:{
                    path:{
                        group:data.partyType
                    },
                    query:{
                        page:DEFAULT_PAGE,
                        size:DEFAULT_SIZE,
                        query:data.query,
                        enabled:DEFAULT_ENABLED
                    }
                }
            })
            groups = res.data?.pagination_result.results || []
            actions = res.data?.actions || []
            // console.log(res.error)
            break
        }
        case "create-group":{
            const res = await client.POST("/group",{
                body:data.createGroup
            })
            message = res.data?.message
            error = res.error?.detail
            break
        }
    }
    return json({
        message,error,groups,actions
    })
}