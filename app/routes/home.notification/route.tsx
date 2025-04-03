import { LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"

type ActionData = {
    action:string
}

export const action = async({request}:LoaderFunctionArgs)=>{
    const data= await request.json() as ActionData
    const client = apiClient({request})
    let notificationCount:number | undefined = undefined
    switch(data.action) {
        case "notification-count":{
            const res =await client.GET("/notification/count")
            notificationCount = res.data?.count
            break
        }
    }
    return {
        notificationCount,
    }
}