import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import ItemStockClient from "./item-stock.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { z } from "zod";
import { addStockLevelSchema } from "~/util/data/schemas/stock/item-stock-schema";

type ActionData = {
    action:string
    addItemStockLevel:z.infer<typeof addStockLevelSchema>
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string|undefined = undefined;
    let error:string |undefined = undefined
    switch(data.action){
        case "add-item-stock-level":{
            const d = data.addItemStockLevel
            const res = await client.POST("/stock/item/level",{
                body:{
                    item_uuid:d.itemUuid,
                    enabled:d.enabled,
                    warehouse_uuid:d.warehouseUuid,
                    stock:d.stock,
                    outOfStockThreshold:d.outOfStockThreshold
                }
            })
            console.log(res.error)
            message= res.data?.message
            error = res.error?.detail
            break;
        }
        case "edit-item-stock-level":{
            const d = data.addItemStockLevel
            const res = await client.PUT("/stock/item/level",{
                body:{
                    item_uuid:d.itemUuid,
                    enabled:d.enabled,
                    warehouse_uuid:d.warehouseUuid,
                    stock:d.stock,
                    outOfStockThreshold:d.outOfStockThreshold
                }
            })
            console.log(res.error)
            message= res.data?.message
            error = res.error?.detail
            break;
        }
    }
    return json({
        message,error
    })
}

export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams

    const res = await client.GET("/stock/item/level/item",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
                parentId:searchParams.get("id") || "",
            }
        }
    })
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions
    })
}

export default function ItemStock(){
    return <ItemStockClient/>
}