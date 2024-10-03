import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import AccountLedgerDetailClient from "./account-ledger-detail.client"
import { handleError } from "~/util/api/handle-status-code"

export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/ledger/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || ""
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