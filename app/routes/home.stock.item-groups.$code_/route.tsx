import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import ItemGroupDetailClient from "./item-group.client"
import { z } from "zod"
import { createItemGroupSchema } from "~/util/data/schemas/stock/item-group-schema"



export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/stock/item-group/{id}",{
        params:{
            path:{
                id:params.code || ""
            }
        }
    })
    return json({
        itemGroup:res.data?.result
    })
}

export default function ItemGroupDetail(){
    return (
        <ItemGroupDetailClient/>
    )
}