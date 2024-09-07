import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import SuppliersClient from "./suppliers.client"
import { z } from "zod"
import { createSupplierSchema } from "~/util/data/schemas/buying/supplier-schema"

type ActionData = {
    action:string
    createSupplier:z.infer<typeof createSupplierSchema>
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    switch(data.action){
        case "create-supplier":{
            const res = await client.POST("/supplier",{
                body:data.createSupplier
            })
            message = res.data?.message
            error = res.error?.detail
            break;
        }
    }
    return json({
        message,error
    })
}

export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url= new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/supplier",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
                query:searchParams.get("query") || "",
            }
        }
    })
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions
    })
}

export default function Supplier(){

    return <SuppliersClient/>
}