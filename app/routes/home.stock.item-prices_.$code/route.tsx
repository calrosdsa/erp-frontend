import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import ItemPriceDetailClient from "./item-price.client"
import SquareItemPrice from "../home.stock.item-prices/components/plugin/SquareItemPrice"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    
    const res = await client.GET("/stock/item/item-price/detail/{id}",{
        params:{
            path:{
                id:params.code || ""
            },
        }
    })
    if(res.data == undefined){
        throw new Error("Fail to fetch data")
    }
    return json({
        itemPriceData:res.data
    })
}

export default function ItemPriceDetail(){
    return (
        <div>
            <ItemPriceDetailClient/>
        </div>
    )
}