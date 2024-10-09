import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { handleError } from "~/util/api/handle-status-code"


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
     const url = new URL(request.url)
     const searchParams = url.searchParams
     const res = await client.GET("/receipt/detail/{id}",{
        params:{
            path:{
                id:params.code || "",
            },
            query:{
                party:params.partyReceipt || "",
            }
        }
     })
     handleError(res.error)

    return json({
        receiptDetail:res.data?.result.entity,
        actions:res.data?.actions
    })
}

export default function ReceiptDetail(){

    return (

        <ReceiptDetail/>
    )
}