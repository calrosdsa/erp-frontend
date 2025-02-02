import apiClient from "~/apiclient";
import ItemsClient from "./items.client";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { components } from "~/sdk";
import { handleError } from "~/util/api/handle-status-code";

type ActionData = {
    action:string
    query:string
}


export const action = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const data  = await request.json() as ActionData
    let items:components["schemas"]["ItemDto"][] = []
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    switch(data.action){
        case "get":{
            const res = await client.GET("/stock/item",{
                params:{
                    query:{
                        page:DEFAULT_PAGE,
                        size:DEFAULT_SIZE,
                        query:data.query,
                    }
                }
            })
            items= res.data?.pagination_result.results || []
            break
        }
    }
    return json({
        items,message,error
    })
}

export const loader = async({request}:LoaderFunctionArgs) =>{
    const url = new URL(request.url)
    const params = url.searchParams
    const client =  apiClient({request})
    const res = await client.GET("/stock/item",{
        params:{
            query:{
                page:params.get("page") || DEFAULT_PAGE,
                size:params.get("size") || DEFAULT_SIZE
            }
        }
    })
    handleError(res.error)
    
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions
    })
}

export default function Items(){
    return (
        <ItemsClient/>
    )
}
