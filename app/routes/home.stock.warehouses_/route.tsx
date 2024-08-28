import { json, LoaderFunctionArgs } from "@remix-run/node";
import WareHousesClient from "./warehouses.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";


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
        paginationResult:res.data?.pagination_result
    })
}

export default function WareHouses(){
    return (
        <WareHousesClient/>
    )
}