import { json, LoaderFunctionArgs } from "@remix-run/node"
import { endOfMonth, format, startOfMonth } from "date-fns";
import apiClient from "~/apiclient"
import CashFlowClient from "./cash-flow.client";


export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const fromDate =
      searchParams.get("fromDate") || format(startOfMonth(new Date()), "yyyy-MM-dd");
    const toDate =
      searchParams.get("toDate") ||
      format(endOfMonth(new Date()), "yyyy-MM-dd");
    const res =await client.GET("/financial-statement/cash-flow",{
        params:{
            query:{
                from_date:fromDate,
                to_date:toDate,
                project:searchParams.get("project") || undefined,
                cost_center:searchParams.get("costCenter")||undefined,
            }
        }
    })
    return json({
        cashFlow:res.data?.result
    })
}

export default function CashFlow(){
    return <CashFlowClient/>
}