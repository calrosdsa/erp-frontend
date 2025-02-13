import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import AccountsClient from "./accounts-ledger.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";

type ActionData = {
    action:string
    query:operations["get-acconts"]["parameters"]["query"]
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let results:components["schemas"]["LedgerDto"][] = []
    let actions:components["schemas"]["ActionDto"][] = []
    console.log("QUERY",data.query)
    switch(data.action){
        case "get":{
            const res =  await client.GET("/ledger",{
                params:{
                    query:data.query
                }
            })
            results = res.data?.result || []
            console.log("results",results)
            actions = res.data?.actions || []
            break;
        }
    }
    return json({
        results,actions
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
        result:res.data?.result,
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