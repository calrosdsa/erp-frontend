import { useOutletContext } from "@remix-run/react"
import { GlobalState } from "~/types/app-types"
import { Role } from "~/types/enums"
import ProfileInfo from "./components/profile"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"


export default function ProfileClient(){
    const globalState = useOutletContext<GlobalState>() 
   
    return (
        <div className="w-full">
           <ProfileInfo/>
        </div>
    )
}