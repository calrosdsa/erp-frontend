import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import JournalEntryDetailClient from "./journal-entry-detail.client"
import { handleError } from "~/util/api/handle-status-code"


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/cost-center/detail/{id}",{
        params:{
            path:{
                id:params.name || ""
            }
        }
    })
    handleError(res.error)
    return json({
        costCenter:res.data?.result.entity
    })
}

export default function JournalEntryDetail(){
    return <JournalEntryDetailClient/>
}