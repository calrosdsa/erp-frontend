import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import SerialNoClientDetail from "./serial-no-detail.client"
import { handleError } from "~/util/api/handle-status-code"


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/serial-no/detail/{id}",{
        params:{
            path:{
                id:params.serialNo || ""
            }
        }
    })
    console.log(res.error)
    handleError(res.error)
    return json({
        serialNo:res.data?.result.entity,
        actions:res.data?.actions,
        activities:res.data?.result.activities,
    })
}

export default function SerialNoDetail(){
    return <SerialNoClientDetail/>
}