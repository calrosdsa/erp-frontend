import { useOutletContext } from "@remix-run/react"
import { GlobalState } from "~/types/app"
import { Role } from "~/types/enums"
import ClientProfile from "./components/client-profile"


export default function ProfileClient(){
    const globalState = useOutletContext<GlobalState>() 
    return (
        <div className="w-full">
           {globalState.session.role == Role.ROLE_CLIENT &&
           <ClientProfile/>
           }
        </div>
    )
}