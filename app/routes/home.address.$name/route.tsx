import { json, LoaderFunctionArgs } from "@remix-run/node"
import AddressClient from "./address.client"
import apiClient from "~/apiclient"
import { handleError } from "~/util/api/handle-status-code"

export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const res = await client.GET("/address/detail/{id}",{
        params:{
            path:{
                id:url.searchParams.get("id") || ""
            }
        }
    })
    // console.log(res.data)
    handleError(res.error)
    return json({
        address:res.data?.result.entity,
        actions:res.data?.actions,
    })
}

export default function Address(){
    return <AddressClient/>
}