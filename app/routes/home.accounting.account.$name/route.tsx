import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import AccountLedgerDetailClient from "./account-ledger-detail.client"
import { handleError } from "~/util/api/handle-status-code"

export const loader = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const res = await client.GET("/ledger/detail/{id}",{
        params:{
            path:{
                id:decodeURIComponent(params.name || ""),
            }
        }
    })
    handleError(res.error)

    return json({
        actions:res.data?.actions,
        accountDetail:res.data?.result.entity
    })
}

export default function AccountLedgerDetail(){
    return <AccountLedgerDetailClient/>
}