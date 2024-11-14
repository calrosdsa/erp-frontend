import { json, LoaderFunctionArgs } from "@remix-run/node"
import { endOfMonth, format, startOfMonth } from "date-fns";
import apiClient from "~/apiclient"
import { DEFAULT_CURRENCY } from "~/constant";
import { TimeUnit, timeUnitToJSON } from "~/gen/common";
import ProfitAndLossClient from "./profit-and-loss.client";
import { fromTheme } from "tailwind-merge";

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const fromDate =
      searchParams.get("fromDate") || format(startOfMonth(new Date()), "yyyy-MM-dd");
    const toDate =
      searchParams.get("toDate") ||
      format(endOfMonth(new Date()), "yyyy-MM-dd");
    const timeUnit = searchParams.get("time_unit") || timeUnitToJSON(TimeUnit.month)
    console.log(fromDate,toDate)
    const res = await client.GET("/financial-statement/profit-and-loss",{
        params:{
            query:{
                from_date:fromDate,
                to_date:toDate,
                time_unit:timeUnit,
            }
        }
    }) 
    return json({
        profitAndLoss:res.data?.result
    })
}

export default function ProfitAndLoss(){
    return <ProfitAndLossClient/>  
}