import { json, LoaderFunctionArgs } from "@remix-run/node"
import PurchaseOrderClient from "./purchase-order.client"
import apiClient from "~/apiclient"
import { PartyType } from "~/types/enums"


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
                party:PartyType.PARTY_PURCHASE_ORDER
            }
        }
    })

    return json({
        actions:res.data?.actions,
        order:res.data?.result.entity
    })
}

export default function PurchaseOrder(){
    return <PurchaseOrderClient/>
}