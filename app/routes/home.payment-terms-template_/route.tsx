import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { DEFAULT_COLUMN, DEFAULT_ORDER, DEFAULT_SIZE, LOAD_ACTION } from "~/constant"
import { handleError } from "~/util/api/handle-status-code"
import TermsAndConditionsClient from "./payment-terms-template.client"
import { components, operations } from "~/sdk"
import PaymentTermsTemplateClient from "./payment-terms-template.client"
import { ShouldRevalidateFunctionArgs } from "@remix-run/react"

type ActionData ={
    action:string
    query:operations["payment-terms-template"]["parameters"]["query"]
}

export const action = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const data =await request.json()as ActionData
    let results:components["schemas"]["PaymentTermsTemplateDto"][] = []
    let actions:components["schemas"]["ActionDto"][] = []
    switch(data.action){
        case "get":{
            const res = await client.GET("/payment-terms-template",{
                params:{
                    query:data.query
                }
            })
            results = res.data?.result || []
            actions = res.data?.actions || []
            break;
        }
    }
    return json({
        results,
        actions
    })
}

export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.action == LOAD_ACTION) {
    return defaultShouldRevalidate;
  }
  if (formMethod === "POST") {
    return false;
  }
  return defaultShouldRevalidate;
}

export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/payment-terms-template",{
        params:{
            query:{
                size:searchParams.get("size") || DEFAULT_SIZE,
                status:searchParams.get("status") || undefined,
                name:searchParams.get("name") || undefined,
                column:searchParams.get("column") || DEFAULT_COLUMN,
                orientation: searchParams.get("orientation") || DEFAULT_ORDER,
                created_at: searchParams.get("created_at") || "",
            }
        }
    })
    handleError(res.error)
    return json({
        results:res.data?.result,
        actions:res.data?.actions,
        filters:res.data?.filters
    })
}

export default function PaymentTermsTemplate(){
    return (
        <PaymentTermsTemplateClient/>
    )
}