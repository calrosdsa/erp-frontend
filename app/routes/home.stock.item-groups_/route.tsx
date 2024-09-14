import { json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { PartyType } from "~/types/enums";
import ItemGroupsClient from "./item-groups.client";
import { handleError } from "~/util/api/handle-status-code";

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client =apiClient({request})
    const url= new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/group/{party}",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
            },
            path:{
                party:PartyType.PARTY_ITEM_GROUP,
            },
        }
    })
    handleError(res.error)
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions,
    })
}

export default  function SupplierGroups(){
    return <ItemGroupsClient/>
}