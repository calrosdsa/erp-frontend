import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import AccountsClient from "./accounts.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { components } from "~/sdk";

type ActionData = {
    action:string
    query:string
    isGroup:boolean
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let accounts:components["schemas"]["LedgerDto"][] = []
    let actions:components["schemas"]["ActionDto"][] = []
    switch(data.action){
        case "get":{
            const res =  await client.GET("/ledger",{
                params:{
                    query:{
                        page:DEFAULT_PAGE,
                        size:DEFAULT_SIZE,
                        query:data.query,
                        is_group:data.isGroup.toString(),
                    }
                }
            })
            accounts = res.data?.pagination_result.results || []
            actions = res.data?.actions || []
            break;
        }
    }
    return json({
        accounts,actions
    })
}

export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/ledger",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
                query:searchParams.get("query") || "",
            }
        }
    })
    console.log(res.error)
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions
    })
}
export default function  Accounts(){
    return (
        <div>
            <AccountsClient/>
        </div>
    )
}