import { accountLedgerDataSchema, mapToAccountLedgerData } from "~/util/data/schemas/accounting/account-ledger.schema"
import NewAccountClient from "./new-account.client"
import { z } from "zod"
import { ActionFunctionArgs, json } from "@remix-run/node"
import apiClient from "~/apiclient"
import { components } from "~/sdk"

type ActionData = {
    action:string
    createAccountLedger:z.infer<typeof accountLedgerDataSchema>
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data=await request.json() as ActionData
    let message:string | undefined  = undefined
    let error:string | undefined = undefined
    let accountLedger:components["schemas"]["LedgerDto"] | undefined = undefined
    switch(data.action){
        case "create-ledger-account":{
            const d =data.createAccountLedger
            const res = await client.POST("/ledger",{
                body:mapToAccountLedgerData(d)
            })
            error = res.error?.detail
            message = res.data?.message
            accountLedger = res.data?.result
            break
        }

    }
    return json({
        message,error,accountLedger,
    })
}
export default function NewAccount(){
    return (
        <NewAccountClient/>
    )
}