import apiClient from "~/apiclient";
import ItemsClient from "./items.client";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { DEFAULT_SIZE } from "~/constant";



export const loader = async({request}:LoaderFunctionArgs) =>{
    const url = new URL(request.url)
    const params = url.searchParams
    const client =  apiClient({request})
    const res = await client.GET("/stock/item",{
        params:{
            query:{
                page:params.get("page") || "1",
                size:params.get("size") || DEFAULT_SIZE
            }
        }
    })
    return json({
        data:res.data
    })
}

export default function Items(){
    return (
        <ItemsClient/>
    )
}
