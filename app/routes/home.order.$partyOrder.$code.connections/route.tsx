import { json, LoaderFunctionArgs } from "@remix-run/node"
import OrderConnectionsClient from "./order-connections.client"

export const loader = async({request}:LoaderFunctionArgs) =>{

    return json({})
}

export default function OrderConnections(){
    return <OrderConnectionsClient/>
}
