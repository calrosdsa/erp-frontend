import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import JournalEntryDetailClient from "./stock-entry-detail.client"
import { handleError } from "~/util/api/handle-status-code"
import StockEntry from "../home.stock.stockEntry_/route"


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/stock-entry/detail/{id}",{
        params:{
            path:{
                id:params.name || ""
            }
        }
    })
    handleError(res.error)
    return json({
        stockEntry:res.data?.result.entity
    })
}

export default function JournalEntryDetail(){
    return <JournalEntryDetailClient/>
}