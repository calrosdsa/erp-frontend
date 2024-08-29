import apiClient from "~/apiclient";
import ItemAttributeClient from "./item-attribute.client";
import { LoaderFunctionArgs } from "react-router";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { upsertItemAttributeValueSchema } from "./components/upsert-item-attribute-value";
import { useTranslation } from "react-i18next";
import { makeZodI18nMap } from "zod-i18n-map";
import { Order } from "~/types/enums";
import { components } from "~/sdk";

type ActionData = {
    action:string
    itemAttributeData:z.infer<typeof upsertItemAttributeValueSchema>
    code:string
}
export const action = async({request}:ActionFunctionArgs) =>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    console.log("ACTION DATA    ",data)
    let error:string | undefined = undefined
    let responseMessage:string | undefined = undefined
    let itemAttribute:components["schemas"]["ItemAttribute"] | undefined =  undefined
    switch(data.action){
        case "get" :{
            const res = await client.GET("/stock/item/item-attribute/{id}",{
                params:{
                    path:{
                        id:decodeURIComponent(data.code) || "",
                    },
                    query:{
                        order:Order.ASC,
                        column:"ordinal"
                    },
        
                }
            })
            if(res.data){
                itemAttribute = res.data.result
            }
            break;
        } 
        case "create-item-attribute-value":{
            const itemAttributeV = data.itemAttributeData
            const res  = await client.POST("/stock/item/item-attribute/item-attribute-value",{
                body:{
                    abbreviation: itemAttributeV.abbreviation,
                    ordinal: Number(itemAttributeV.ordinal),
                    value: itemAttributeV.value,
                    itemAttributeId:itemAttributeV.itemAttributeId
                }
            })
            if(res.error != undefined) {
                error = res.error.detail
            }
            if(res.data!= undefined){
                responseMessage = res.data.message
            }
            break
        }
        case "update-item-attribute-value":{
            const itemAttributeV = data.itemAttributeData
            const res  = await client.PUT("/stock/item/item-attribute/item-attribute-value",{
                body:{
                    abbreviation: itemAttributeV.abbreviation,
                    ordinal: Number(itemAttributeV.ordinal),
                    value: itemAttributeV.value,
                    itemAttributeId:itemAttributeV.itemAttributeId,
                    id:itemAttributeV.id
                }
            })
            if(res.error != undefined) {
                error = res.error.detail
            }
            if(res.data!= undefined){
                responseMessage = res.data.message
            }
            break
        }
    }
    return json({
        error,
        responseMessage,
        itemAttribute
    })
}

export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    console.log("NAME",decodeURIComponent(params.code||""))
    const res = await client.GET("/stock/item/item-attribute/{id}",{
        params:{
            path:{
                id:decodeURIComponent(params.code || "") ,
            },
            query:{
                order:Order.ASC,
                column:"ordinal"
            },

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