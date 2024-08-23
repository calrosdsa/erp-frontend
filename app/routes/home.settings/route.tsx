import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import SettingClient from "./settings.client"

export const action = async({request}:ActionFunctionArgs)=>{
    const formData = await request.formData()
    const action = formData.get("action")?.toString()
    console.log("ACTION",action)
    return json({
        actionType:action
    })
}

export const loader = async({request}:LoaderFunctionArgs )=>{
    return json({
    })
}
export default function Settings(){
    return(
        <div className="h-full">
        <SettingClient/>
        </div>
    )
}