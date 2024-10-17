import { json, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import apiClient from "~/apiclient"
import { ChartType, chartTypeToJSON, TimeUnit, timeUnitToJSON } from "~/gen/common"
import ChartDataClient from "./chart.client"
import { endOfMonth, format, startOfMonth, subDays } from "date-fns"

export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const start = searchParams.get("start") || format(startOfMonth(new Date()),"yyyy-MM-dd")
    const end = searchParams.get("end") || format(endOfMonth(new Date()).toLocaleDateString(),"yyyy-MM-dd")
    const timeUnit = searchParams.get("time_unit") || timeUnitToJSON(TimeUnit.day)
    console.log(start,end)
    const res =await client.POST("/regate/chart/{chart}",{
        body:{
            start_date:start,
            end_date:end,
            time_unit:timeUnit,
        },
        params:{
            path:{
                chart:params.chart?.toUpperCase() || ""
            }
        }
    })
    console.log(res.error,res.data)
    return json({
        chartData:res.data?.result,
    })
}

export default function ChartData(){
    return (
        <div>
            <ChartDataClient/>
        </div>
    )
}