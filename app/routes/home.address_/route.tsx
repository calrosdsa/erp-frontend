import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { handleError } from "~/util/api/handle-status-code"
import AddressesClient from "./addresses.client"


export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/party/address",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
                query:searchParams.get("query") || "",
            }
        }
    })
    console.log(res.data,res.error)
    handleError(res.error)
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions,
    })
}

export default function Addresses(){
    return (
        <div>
            <AddressesClient/>
        </div>
    )
}