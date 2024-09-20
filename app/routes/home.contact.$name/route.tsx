import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { handleError } from "~/util/api/handle-status-code"
import ContactClient from "./contact.client"


export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/party/contact/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || ""
            }
        }
    })
    handleError(res.error)
    return json({
        contact:res.data?.result,
        actions:res.data?.actions
    })
}

export default function Contact(){
    return <ContactClient/>
}