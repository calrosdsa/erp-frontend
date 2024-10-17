import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { handleError } from "~/util/api/handle-status-code"
import EventsClient from "./events.client"
import { z } from "zod"
import { createEventSchema } from "~/util/data/schemas/regate/event-schema"
import { components } from "~/sdk"


type ActionData = {
    action:string
    createEvent:z.infer<typeof createEventSchema>
    query:string
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string |undefined = undefined
    let events:components["schemas"]["EventBookingDto"][] = []
    let actions:components["schemas"]["ActionDto"][] = []
    switch(data.action){
        case "get":{
            const res = await client.GET("/regate/event",{
                params:{
                    query:{
                        page:DEFAULT_PAGE,
                        size:DEFAULT_SIZE,
                        query:data.query
                    }
                }
            })
            console.log("EVENTS",res.data)
            actions = res.data?.actions || []
            events = res.data?.pagination_result.results || []
            break
        }
        case "create-event":{
            const d = data.createEvent
            const res =await client.POST("/regate/event",{
                body:{
                    name:d.name,
                    description:d.description
                }
            })
            error = res.error?.detail
            message = res.data?.message
            break
        }
    }
    return json({
        message,error,actions,events
    })
}

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res =await client.GET("/regate/event",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
                query:searchParams.get("query") || "",
            }
        }
    })
    handleError(res.error)
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions
    })
}

export default function RegateEvents(){
    return <EventsClient/>
}