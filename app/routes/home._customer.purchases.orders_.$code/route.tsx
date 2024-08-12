import { ClientOnly } from "remix-utils/client-only";
import OrderDetailClient from "./order-detail.client";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";

export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/selling/salesorder/{code}",{
        params:{
            path:{
                code:params.code as string
            }
        }
    })
    return json({
        data:res.data
    })
}

export default function OrderDetail(){
    return (
        <ClientOnly>
            {()=>{
                return(
                    <OrderDetailClient/>
                )
            }}
        </ClientOnly>
    )
}