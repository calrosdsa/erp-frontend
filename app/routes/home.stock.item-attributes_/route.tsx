import { json, LoaderFunctionArgs } from "@remix-run/node";
import ItemAttributesClient from "./item-attributes.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";



export const loader = async({request}:LoaderFunctionArgs) =>{
    const url = new URL(request.url)
    const params = url.searchParams
    const client = apiClient({request})
    const res = await client.GET("/stock/item/item-attribute",{
        params:{
            query:{
                page:params.get("page") || DEFAULT_PAGE,
                size:params.get("size") || DEFAULT_SIZE,
            }
        }
    })

    return json({
        pagination_result:res.data?.pagination_result
    })
}

export default function ItemAttributes(){


    return (
        <div>
            <ItemAttributesClient/>
        </div>
    )
}