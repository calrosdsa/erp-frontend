import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import PriceListDetailClient from "./price-list-detail.client"

export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/stock/item/price-list/{id}",{
        params:{
            path:{
                id:params.code || ""
            }
        }
    })

    return json({
        priceList:res.data?.result
    })
}
export default function PriceListDetail(){
    return (
        <PriceListDetailClient/>
    )
}