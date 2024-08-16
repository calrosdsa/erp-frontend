import FallBack from "@/components/layout/Fallback";
import { ClientOnly } from "remix-utils/client-only";
import CustomerOrders from "./customer-orders.client";
import apiClient from "~/apiclient";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";


export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const res = await client.GET("/selling/salesorder/client",{
        params:{
            query:{
                page:DEFAULT_PAGE,
                size:DEFAULT_SIZE,
            }
        }
    })
    
    return json({
        data:res.data
    })    
}

export default function Orders(){
    return (
        <ClientOnly fallback={<FallBack/>}>
            {()=>{
                return(
                    <CustomerOrders/>
                )
            }}
        </ClientOnly>
    )
}