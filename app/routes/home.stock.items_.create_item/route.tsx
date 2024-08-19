import { ActionFunctionArgs, json } from "@remix-run/node";
import CreateItemClient from "./itemCreate.client";
import apiClient from "~/apiclient";
import { components } from "~/sdk";


export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    console.log("ACTION CREATE ITEM")
    const data = await request.json() as components["schemas"]["CreateItemRequestBody"]
    
    console.log(data.plugins)
    const res = await client.POST("/stock/item",{
        body:data
    })
    let errorAction:string | undefined = undefined
    console.log("RESPONSE",res.data,res.error)
    errorAction = res.error?.detail
    return json({
      responseMessage:res.data,
      errorAction:errorAction,
    });
}

export default function CreateItem(){

    return (
        <CreateItemClient/>
    )
}