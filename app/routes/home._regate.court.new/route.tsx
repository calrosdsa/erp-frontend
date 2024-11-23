import { ActionFunctionArgs, json } from "@remix-run/node"
import { z } from "zod"
import apiClient from "~/apiclient"
import { components } from "~/sdk"
import { createCourtSchema } from "~/util/data/schemas/regate/court-schema"
import NewCourtClient from "./new-court.client"


type ActionData = {
    createCourt:z.infer<typeof createCourtSchema>
    action:string
}

export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    let court:components["schemas"]["CourtDto"] | undefined = undefined
    switch(data.action){
        case "create-court":{
            const d = data.createCourt
            const res = await client.POST("/court",{
                body:{
                    name:d.name,
                    // enabled:d.enabled
                }
            })
            message= res.data?.message
            error =  res.error?.detail
            court = res.data?.result
            break;
        }
    }
    return json({
        message,error,court
    })
}
export default function CreateCourt(){
    
    return (
        <NewCourtClient/>
    )
}