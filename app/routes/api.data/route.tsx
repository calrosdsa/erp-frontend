import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { components } from "~/sdk"


type Action = {
    action:string
}
export const action = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const data = await request.json() as Action
    const searchParams = url.searchParams
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    let currencies:components["schemas"]["CurrencyDto"][] =[]
    switch(data.action){
        case "get-currencies":{
            const res = await client.GET("/currency",{
                params:{
                    query:{
                        page:searchParams.get("page") || DEFAULT_PAGE,
                        size:searchParams.get("size") || DEFAULT_SIZE,
                        query:searchParams.get("query") || "",
                    }
                }
            })
            currencies = res.data?.pagination_result.results || []
        }
    }
    return json({
        message,error,currencies
    })
}