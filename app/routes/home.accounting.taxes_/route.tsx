import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import TaxesClient from "./taxes.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { z } from "zod";
import { createTaxSchema } from "~/util/data/schemas/accounting/tax-schema";
import { components } from "~/sdk";
import { handleError } from "~/util/api/handle-status-code";


type ActionData = {
    action:string
    addTaxData:z.infer<typeof createTaxSchema>
}
export const action = async({request}:ActionFunctionArgs) =>{
    const client = apiClient({request})
    const data =await request.json() as ActionData
    let result:components["schemas"]["Tax"][] = []
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    switch(data.action){
        case "add-tax":{
            const res = await client.POST("/accounting/tax",{
                body:data.addTaxData
            })
            message = res.data?.message
            error = res.error?.detail
            break;
        }
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
        result,
        message,
        error,
        
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
    handleError(res.error)

    return json({
        result:res.data?.pagination_result,
        actions:res.data?.actions
    })
}

export default function Taxes(){
    return (
        <TaxesClient/>
    )
}