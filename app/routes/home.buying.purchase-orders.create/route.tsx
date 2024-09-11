import { ActionFunctionArgs, json } from "@remix-run/node";
import CreatePurchaseOrdersClient from "./create-purchase-orders.client";
import { z } from "zod";
import { createPurchaseSchema, orderLineSchemaToOrderLineDto } from "~/util/data/schemas/buying/purchase-schema";
import apiClient from "~/apiclient";
import { currencySchemaToCurrencyDto } from "~/util/data/schemas/app/currency-schema";
import { components } from "~/sdk";


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
            const res = await client.POST("/purchase/order/",{
                body:{
                    supplier:d.supplier,
                    name:d.name,
                    currency:currencySchemaToCurrencyDto(d.currency),
                    delivery_date:d.delivery_date?.toString(),
                    lines:lines,
                }
            })
            message = res.data?.message
            error = res.error?.detail
            order = res.data?.result.entity
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
