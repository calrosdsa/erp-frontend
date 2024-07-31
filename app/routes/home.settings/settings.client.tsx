import { useActionData, useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import { action, loader } from "./route"
import { SessionDefaultDrawer } from "../home/components/SessionDefaults"
import { GlobalState } from "~/types/app"


export default function SettingClient(){
    const navigate = useNavigate()
    const state = useOutletContext<GlobalState>()
    return (
        <div>
            
            Settings
            {JSON.stringify(state)}
        </div>
    )
}