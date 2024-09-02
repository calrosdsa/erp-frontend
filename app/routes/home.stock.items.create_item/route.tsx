import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import CreateItemClient from "./itemCreate.client";
import apiClient from "~/apiclient";
import { components } from "index";
import { routes } from "~/util/route";


export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    console.log("ACTION CREATE ITEM")
    const data = await request.json() as components["schemas"]["CreateItemRequestBody"]    
    const res = await client.POST("/stock/item",{
        body:data
    })
    let errorAction:string | undefined = undefined
    console.log("RESPONSE",res.data,res.error)
    errorAction = res.error?.detail
    if(res.data){
        const r = routes
        return redirect(r.toItemDetail(res.data.result.Code))
    }
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