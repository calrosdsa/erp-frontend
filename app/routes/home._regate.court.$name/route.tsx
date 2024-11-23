import { ActionFunctionArgs, defer, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { handleError } from "~/util/api/handle-status-code"
import CourtDetailClient from "./court.client"
import { z } from "zod"
import { components } from "~/sdk"
import { FetchResponse } from "openapi-fetch"
import { editCourtSchema } from "~/util/data/schemas/regate/court-schema"


type ActionData = {
    action:string
    updateCourtRateData:components["schemas"]["UpdateCourtRatesBody"]
    editCourt:z.infer<typeof editCourtSchema>
}

export const action  =  async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data =await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string |undefined = undefined
    switch(data.action){
        case "update-court-rate":{
            const res =await client.POST("/court-rate",{
                body:data.updateCourtRateData
            })
            error = res.error?.detail
            message = res.data?.message
            console.log(res.data?.message,res.error)
            break
        }
        case "edit-court": {
            const d = data.editCourt;
            const res = await client.PUT("/court", {
              body: {
                court_id: d.courtID,
                name: d.name,
              },
            });
            error = res.error?.detail;
            message = res.data?.message;
            break;
          }
    }
    return json({
        message,error
    })
}

export const loader = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const tab = searchParams.get("tab")
    let courtRates:Promise<FetchResponse<any,any,any>> | undefined = undefined
    const res =await client.GET("/court/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || "",
            }
        }
    })
    if(tab && tab == "schedule") {
        courtRates = client.GET("/court-rate/{id}",{
            params:{
                path:{
                    id:searchParams.get("id") || "",
                }
            }
        })
    }
    handleError(res.error)
    return defer({
        court:res.data?.result.entity,
        actions:res.data?.actions,
        courtRates:courtRates,
        activities:res.data?.result.activities,
    })
}

export default function CourtDetail(){
    return <CourtDetailClient/>
}