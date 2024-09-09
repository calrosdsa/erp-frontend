import { ActionFunctionArgs, json } from "@remix-run/node";
import CreatePurchaseOrdersClient from "./create-purchase-orders.client";


type ActionData = {
    action:string
}

export const action = ({request}:ActionFunctionArgs)=>{
    
    return json({})
}

export default function CreatePurchaseOrders(){
    return (
        <div>
            <CreatePurchaseOrdersClient/>
        </div>
    )
}
