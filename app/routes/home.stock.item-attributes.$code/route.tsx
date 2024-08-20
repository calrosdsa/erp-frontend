import apiClient from "~/apiclient";
import ItemAttributeClient from "./item-attribute.client";
import { LoaderFunctionArgs } from "react-router";
import { json } from "@remix-run/node";


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/stock/item/item-attribute/{id}",{
        params:{
            path:{
                id:params.code || "",
            }
        }
    })
    
    return json({
        error:res.error,
        itemAttribute:res.data?.result
    })
}

export default function ItemAttributesDetail(){
    
    return (
        <div>
            <ItemAttributeClient/>
        </div>
    )
}