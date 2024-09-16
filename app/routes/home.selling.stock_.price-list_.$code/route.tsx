import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import PriceListDetailClient from "./price-list-detail.client"
import { handleError } from "~/util/api/handle-status-code"

export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/stock/item/price-list/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || ""
            }
        }
    })
    handleError(res.error)
    console.log(res.data?.result)
    return json({
        priceList:res.data?.result.entity,
        actions:res.data?.actions,
    })
}
export default function PriceListDetail(){
    return (
        <PriceListDetailClient/>
    )
}