import apiClient from "~/apiclient";
import ACompanyClient from "./a-company.client";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import apiClientAdmin from "~/apiclientAdmin";


export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClientAdmin({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/admin/company",{
        params:{
            query:{
                page:searchParams.get("page") ||DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE,
            }
        }
    })
    console.log(res.data,res.error)
    return json({
        paginationResult:res.data?.pagination_result,
    })
}

export default function ACompany(){
    return <ACompanyClient/>
}