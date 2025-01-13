import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClientAdmin from "~/apiclientAdmin"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import EntityClient from "./entity.client"

type ActionData = {
    
}
export const action = async({request}:ActionFunctionArgs)=>{
    return json({

    })
}

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClientAdmin({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/admin/core/entity",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
            }
        }
    })
    return json({
        paginationResult:res.data?.pagination_result
    })
}

export default function Entity(){
    return <EntityClient/>
}