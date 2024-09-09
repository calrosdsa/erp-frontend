import { json, LoaderFunctionArgs } from "@remix-run/node";
import PurchasesClient from "./purchases.client";
import { Laptop } from "lucide-react";
import apiClient from "~/apiclient";
import { PartyType } from "~/types/enums";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";

export const loader = async ({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/order/{party}",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
                query:searchParams.get("query") || "",
            },
            path:{
                party:PartyType.PARTY_PURCHASE_ORDER,
            }
        }
    })
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions
    })
}

export default function Purchases(){
    return <PurchasesClient/>
}