import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClientAdmin from "~/apiclientAdmin"
import ACompanyDetailClient from "./a-company-detail.client"
import { components } from "~/sdk"
type ActionData = {
    action:string
    updateModules:components["schemas"]["CompanyEntityDto"][]
}
export  const action = async({request}:ActionFunctionArgs) =>{
    const client = apiClientAdmin({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    console.log(data)
    switch(data.action){
        case "update-modules":{
            const res = await client.POST("/admin/company/modules",{
                body:{
                    modules:data.updateModules
                }
            })
            message = res.data?.message
            error = res.error?.detail
            break;
        }
    }
    return json({
        message,error
    })
}

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClientAdmin({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const tab = searchParams.get("tab")
    const id = searchParams.get("id") || ""
    const res = await client.GET("/admin/company/detail/{id}",{
        params:{
            path:{
                id:id
            }
        }
    })
    let companyEntities:components["schemas"]["CompanyEntityDto"][] = []
    let companyUsers:components["schemas"]["UserDto"][] = []
    switch(tab) {
        case "modules":{
            const response = await client.GET("/admin/company/modules",{
                params:{
                    query:{
                        id:id,
                    }
                }
            })
            companyEntities = response.data?.result || []
            break;            
        }
        case "users":{
            const response = await client.GET("/admin/company/users",{
                params:{
                    query:{
                        id:id
                    }
                }
            })
            companyUsers = response.data?.result || []
            break;
        }
    }
    return json({
        company:res.data?.result.entity,
        companyEntities,
        companyUsers,
    })
}
export default function ACompanyDetail(){
    return <ACompanyDetailClient/>
}