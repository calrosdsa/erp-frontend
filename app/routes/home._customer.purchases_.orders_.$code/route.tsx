import { ClientOnly } from "remix-utils/client-only";
import OrderDetailClient from "./order-detail.client";
import { ActionFunctionArgs, defer, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { useActionData } from "@remix-run/react";


type OrderCustomerActions = {
    action:string
    data:string
}


export const action = async({request,params}:ActionFunctionArgs) =>{
    const client = apiClient({request})
    const body = await request.json() as OrderCustomerActions
    console.log(body)
    switch(body.action){
        case "square-cancel-subscription":{
            const res = await client.POST("/square/subscription/cancel",{
                body:JSON.parse(body.data)
            })
            if(res.error != undefined){
                return json({
                    errorAction:res.error.detail
                })
            }
            break;
        }
    }
    return json({
        errorAction:undefined
    })
}

export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/selling/salesorder/{code}",{
        params:{
            path:{
                code:params.code as string
            }
        }
    })
    console.log("ORDER ERROR",res.error)
    console.log("ORDER DATA",res.data)
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