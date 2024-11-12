import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClientAdmin from "~/apiclientAdmin"
import ACompanyDetailClient from "./a-company-detail.client"
import { components } from "~/sdk"
import { z } from "zod"
import { addCompanyUserSchema } from "./tab/a-company-users"
type ActionData = {
    action:string
    updateModules:components["schemas"]["CompanyEntityDto"][]
    addUser:z.infer<typeof addCompanyUserSchema>
}
export  const action = async({request}:ActionFunctionArgs) =>{
    const client = apiClientAdmin({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    console.log(data)
    switch(data.action){
        case "add-user":{
            const d = data.addUser
            const res = await client.POST("/admin/company/user",{
                body:{
                    first_name:d.givenName,
                    last_name:d.familyName,
                    identifier:d.email,
                    company_id:d.companyID,
                }
            })
            message = res.data?.message
            error = res.error?.detail
            break
        }
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
            const response = await client.GET("/admin/company/user",{
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