import { json, LoaderFunctionArgs } from "@remix-run/node";
import SupplierGroupsClient from "./supplier-groups.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { PartyType } from "~/types/enums";

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client =apiClient({request})
    const url= new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/group/{group}",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
            },
            path:{
                group:PartyType.PARTY_SUPPLIER_GROUP,
            },
        }
    })
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions,
    })
}

export default  function SupplierGroups(){
    return <SupplierGroupsClient/>
}