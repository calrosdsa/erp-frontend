import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { DEFAULT_ENABLED, DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import SuppliersClient from "./suppliers.client"
import { z } from "zod"
import { createSupplierSchema } from "~/util/data/schemas/buying/supplier-schema"
import { components } from "~/sdk"

type ActionData = {
    action:string
    createSupplier:z.infer<typeof createSupplierSchema>
    query:string
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    let suppliers:components["schemas"]["SupplierDto"][] = []
    let actions:components["schemas"]["ActionDto"][] = []
    const url = new URL(request.url)
    const searchParams = url.searchParams
    switch(data.action){
        case "create-supplier":{
            const d = data.createSupplier
            const res = await client.POST("/supplier",{
                body:{
                    group:d.group,
                    name:d.name,
                    enabled:d.enabled
                }
            })
            message = res.data?.message
            error = res.error?.detail
            break;
        }
        case "get":{
            const res = await client.GET("/supplier",{
                params:{
                    query:{
                        page:searchParams.get("page") || DEFAULT_PAGE,
                        size:searchParams.get("size") || DEFAULT_SIZE,
                        enabled:DEFAULT_ENABLED,
                        query:data.query || "",
                    }
                }
            })
            suppliers = res.data?.pagination_result.results || []
            actions = res.data?.actions || []
            break;
        }
    }
    return json({
        message,error,suppliers,actions
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