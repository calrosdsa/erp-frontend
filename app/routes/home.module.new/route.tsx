import { ActionFunctionArgs, json } from "@remix-run/node"
import apiClient from "~/apiclient"
import { components } from "~/sdk"
import { mapToModuleData, ModuleDataType } from "~/util/data/schemas/core/module-schema"
import NewModuleClient from "./new-module.client"

type ActionData=  {
    action:string
    moduleData:ModuleDataType
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data =await request.json() as ActionData
    let error:string | undefined  = undefined
    let message:string | undefined = undefined 
    let module:components["schemas"]["ModuleDto"] | undefined = undefined
    switch(data.action){
        case "create-module":{
            const res =await client.POST("/module",{
                body:mapToModuleData(data.moduleData),
            })
            error = res.error?.detail
            message = res.data?.message
            module = res.data?.result
            break
        }
    }
    return json({
        error,message,module
    })
}

export default function NewModule(){
    return (
        <NewModuleClient/>
    )
}