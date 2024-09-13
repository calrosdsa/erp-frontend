import { useOutletContext } from "@remix-run/react"
import { GlobalState } from "~/types/app"
import { Role } from "~/types/enums"
import ProfileInfo from "./components/profile"


export default function ProfileClient(){
    const globalState = useOutletContext<GlobalState>() 
    return (
        <div className="w-full">
           <ProfileInfo/>
        </div>
    )
}