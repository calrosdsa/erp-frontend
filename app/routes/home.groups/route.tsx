import { ActionFunctionArgs, json } from "@remix-run/node"
import { z } from "zod"
import apiClient from "~/apiclient"
import { createGroupSchema } from "~/util/data/schemas/group-schema"

type ActionData = {
    action:string
    createGroup:z.infer<typeof createGroupSchema>
}

export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    switch(data.action){
        
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
        message,error
    })
}