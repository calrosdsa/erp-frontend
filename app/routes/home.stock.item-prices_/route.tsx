import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import ItemPricesClient from "./itemPrices.client"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const params = url.searchParams
    const res = await client.GET("/stock/item/item-price",{
        params:{
            query:{
                page:params.get("page") || DEFAULT_PAGE,
                size:params.get("size") || DEFAULT_SIZE
            }
        }
    })
    console.log(res.data)
    return json({
        data:res.data
    })
}

export default function ItemPrices(){
    return (
        <div>
            <ItemPricesClient/>
        </div>
    )
}