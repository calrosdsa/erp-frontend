import { ActionFunctionArgs, json } from "@remix-run/node";
import CreatePurchaseOrdersClient from "./create-order.client";
import { z } from "zod";
import { createPurchaseSchema, orderLineSchemaToOrderLineDto } from "~/util/data/schemas/buying/purchase-schema";
import apiClient from "~/apiclient";
import { currencySchemaToCurrencyDto } from "~/util/data/schemas/app/currency-schema";
import { components } from "~/sdk";
import { PartyType } from "~/gen/common";


type ActionData = {
    action:string
    createPurchaseOrder:z.infer<typeof createPurchaseSchema>
}

export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    let order:components["schemas"]["OrderDto"] | undefined = undefined
    switch(data.action) {
        case "create-purchase-order":{
            const d = data.createPurchaseOrder
            const lines = d.lines.map(t=>orderLineSchemaToOrderLineDto(t))
            const res = await client.POST("/order",{
                body:{
                    party_uuid:d.supplier.uuid,
                    party_type:PartyType[PartyType.supplier],
                    order_party_type:PartyType[PartyType.purchaseOrder],
                    currency:currencySchemaToCurrencyDto(d.currency),
                    delivery_date:d.delivery_date?.toString(),
                    // lines:lines,
                    date:d.date.toString(),
                    items:{
                        lines:lines,
                    }
                }
            })
            message = res.data?.message
            error = res.error?.detail
            order = res.data?.result.entity
            console.log(res.data,res.error)
            break;
        }
    }
    return json({
        message,error,order
    })
}

export default function CreatePurchaseOrders(){
    return (
        <div>
            <CreatePurchaseOrdersClient/>
        </div>
    )
}
