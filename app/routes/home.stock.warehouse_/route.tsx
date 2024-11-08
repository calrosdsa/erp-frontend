import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import WareHousesClient from "./warehouses.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { z } from "zod";
import { addWareHouseSchema } from "~/util/data/schemas/stock/warehouse-schema";
import { components } from "~/sdk";

type ActionData = {
    action:string
    addWareHouse:z.infer<typeof addWareHouseSchema>
}

export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let error:string | undefined= undefined
    let message:string | undefined = undefined
    let warehouses:components["schemas"]["WareHouseDto"][] = []
    let actions:components["schemas"]["ActionDto"][] = []
    switch(data.action){
        case "add-warehouse":{
            const res = await client.POST("/stock/warehouse",{
                body:data.addWareHouse
            })
            error = res.error?.detail
            message = res.data?.message
            break;
        }
        case "get":{
            const res= await client.GET("/stock/warehouse",{
                params:{
                    query:{
                        page:DEFAULT_PAGE,
                        size:DEFAULT_SIZE,
                    }
                }
            })
            warehouses = res.data?.pagination_result.results || []
            actions = res.data?.actions || []
            break;
        }
    }
    return json({
        error,message,warehouses,actions
    })
}

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const params = url.searchParams
    const res = await client.GET("/stock/warehouse",{
        params:{
            query:{
                page:params.get("page") || DEFAULT_PAGE,
                size:params.get("size") || DEFAULT_SIZE,
            }
        }
    })

    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions,
    })
}

export default function WareHouses(){
    return (
        <WareHousesClient/>
    )
}