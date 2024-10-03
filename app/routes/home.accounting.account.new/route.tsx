import { createAccountLedger } from "~/util/data/schemas/accounting/account-schema"
import NewAccountClient from "./new-account.client"
import { z } from "zod"
import { ActionFunctionArgs, json } from "@remix-run/node"
import apiClient from "~/apiclient"
import { components } from "~/sdk"

type ActionData = {
    action:string
    createAccountLedger:z.infer<typeof createAccountLedger>
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
                body:{
                    account_type:d.accountType,
                    name:d.name,
                    description:d.description,
                    parent_uuid:d.parentUuid,
                    ledger_no:d.ledgerNo,
                    enabled:d.enabled,
                    is_group:d.isGroup
                }
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