import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { PartyType } from "~/gen/common"
import { handleError } from "~/util/api/handle-status-code"
import PurchaseInvoiceDetailClient from "./purchase-invoice.client"

export const loader =  async({request}:LoaderFunctionArgs)=>{
    const  client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/invoice/purchase/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || ""
            },
            query:{
                party:PartyType[PartyType.purchaseInvoice],
            }
        }

    })
    handleError(res.error)
    return json({
        invoiceDetail:res.data?.result.entity,
        actions:res.data?.actions,
    })
}
export default function PurchaseInvoiceDetail(){
    return (
        <div>
            <PurchaseInvoiceDetailClient/>
        </div>
    )
}