import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { handleError } from "~/util/api/handle-status-code"
import MovingFormDetailClient from "./moving-form.client"

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/piano/form/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || ""
            }
        }
    })
    console.log(res.error)
    handleError(res.error)
    return json({
        pianoForm:res.data?.result.entity,
        activities:res.data?.result.activities
    })
}

export default function MovingFormDetail(){
    return (
        <MovingFormDetailClient/>
    )
}