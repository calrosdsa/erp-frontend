import { json, LoaderFunctionArgs } from "@remix-run/node";
import DashboardClient from "./rdashboard.client";
import apiClient from "~/apiclient";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { TimeUnit, timeUnitToJSON } from "~/gen/common";

export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const start = format(startOfMonth(new Date()),"yyyy-MM-dd")
    const end = format(endOfMonth(new Date()).toLocaleDateString(),"yyyy-MM-dd")
    const timeUnit = timeUnitToJSON(TimeUnit.day)
    const res =await client.POST("/regate/chart",{
        body: {
            start_date: start,
            end_date: end,
            time_unit: timeUnit,
        },
       
    })

    return json({
        income:res.data?.result.income,
        incomeAvg:res.data?.result.income_avg,
    })
}
export default function Dashboard(){
    return (
        <DashboardClient/>
    )
}