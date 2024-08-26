import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import TaxesClient from "./taxes.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { components } from "~/sdk";


type ActionData = {
    action:string
    
}
export const action = async({request}:ActionFunctionArgs) =>{
    const client = apiClient({request})
    const data =await request.json() as ActionData
    let result:components["schemas"]["Tax"][] = []
    switch(data.action){
        case "get":{
            const res = await client.GET("/accounting/tax",{
                params:{
                    query:{
                        page:DEFAULT_PAGE,
                        size:DEFAULT_SIZE,
                    }
                }
            })
            if(res.data){
                result = res.data.pagination_result.results
            }
            break;
        }
    }
    return json({
        result
    })
}

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const params = url.searchParams
    const res = await client.GET("/accounting/tax",{
        params:{
            query:{
                page:params.get("page") || DEFAULT_PAGE,
                size:params.get("size") || DEFAULT_SIZE,
            }
        }
    })

    return json({
        result:res.data?.pagination_result
    })
}

export default function Taxes(){
    return (
        <TaxesClient/>
    )
}