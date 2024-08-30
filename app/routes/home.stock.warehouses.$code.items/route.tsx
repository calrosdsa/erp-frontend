import apiClient from "~/apiclient";
import WareHouseItemsClient from "./warehouse-items.client";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";

export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams

    const res = await client.GET("/stock/item/level/warehouse",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
                parentId:params.code || "",
            }
        }
    })
    
    return json({
        paginationResult:res.data?.pagination_result
    })
}

export default function WareHouseItems(){

    return <WareHouseItemsClient/>
}