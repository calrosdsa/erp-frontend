import { json, LoaderFunctionArgs } from "@remix-run/node"
import PurchaseOrderClient from "./purchase-order.client"
import apiClient from "~/apiclient"
import { PartyType } from "~/gen/common"



export const loader = async ({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/order/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id") ||  ""
            },
            query:{
                party:PartyType[PartyType.purchaseOrder]
            }
        }
    })
    // res.data?.related_actions
    console.log("PARTY",res.data?.associated_actions[PartyType[PartyType.payment]])
    return json({
        actions:res.data?.actions,
        order:res.data?.result.entity,
        associatedActions:res.data?.associated_actions
    })
}

export default function PurchaseOrder(){
    return <PurchaseOrderClient/>
}