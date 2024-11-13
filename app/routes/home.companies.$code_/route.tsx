import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import CompanyClient from "./company.client"
import { handleError } from "~/util/api/handle-status-code"
import { components } from "~/sdk"


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const tab = searchParams.get("tab") 
    const res = await client.GET("/company/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || ""
            }
        }
    })
    const companyID = res.data?.result.entity.id.toString() || ""
    handleError(res.error)
    let accountSettings:components["schemas"]["AccountSettingsDto"] | undefined =undefined
    switch(tab) {
        case "accounts":{
            const response = await client.GET("/company/setting/account",{
                params:{
                    query:{
                        id:companyID,
                    }
                }
            })
            accountSettings = response.data?.result
        }
    }
    return json({
        company:res.data?.result.entity,
        accountSettings,
    })
}

export default function Company(){
    return (
        <CompanyClient/>
    )
}