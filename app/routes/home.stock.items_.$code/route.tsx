import { json, LoaderFunctionArgs } from "@remix-run/node";
import ItemDetailClient from "./itemDetail.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const code = params.code
    const res = await client.GET("/stock/item/{id}",{
        params:{
            path:{
                id:code || ""
            }
        }
    })

    const itemPrices = await client.GET("/stock/item/item-price/{itemCode}",{
        params:{
            query:{
                size:DEFAULT_SIZE,
                page:DEFAULT_PAGE,
            },
            path:{
                itemCode:code || ""
            }
        }
    })
    return json({
        data:res.data,
        itemPrices:itemPrices.data
    })
}

export default function ItemDetail(){
    return(
        <div>
            <ItemDetailClient/>
        </div>
    )
}
