import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import BatchBundleDetailClient from "./batch-bundle-detail.client"
import { handleError } from "~/util/api/handle-status-code"


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/batch-bundle/detail/{id}",{
        params:{
            path:{
                id:params.no || ""
            }
        }
    })
    handleError(res.error)
    return json({
        batchBundle:res.data?.result.entity,
        actions:res.data?.actions,
    })
}

export default function BatchBundleDetail(){
    return <BatchBundleDetailClient/>
}