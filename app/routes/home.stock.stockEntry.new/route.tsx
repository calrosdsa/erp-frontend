import { ActionFunctionArgs, json } from "@remix-run/node"
import { z } from "zod"
import apiClient from "~/apiclient"
import { createJournalEntrySchema } from "~/util/data/schemas/accounting/journal-entry-schema"
import NewStockEntryClient from "./new-stock-entry.client"

type ActionData = {
    action:string
    createCostCenter:z.infer<typeof createJournalEntrySchema>
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    switch(data.action) {
        case "create-journal-entry":{
            const d = data.createCostCenter
            const res = await client.POST("/journal",{
                body:{
                    entry_type:d.entryType,
                    posting_date:d.postingDate.toDateString()
                }
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


export default function NewStockEntry(){
    return <NewStockEntryClient/>
}