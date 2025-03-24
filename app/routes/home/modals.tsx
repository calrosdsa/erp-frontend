import { useSearchParams } from "@remix-run/react"
import UserModal from "../home.manage.users.$id/user-modal";

export default function AppModals(){
    const [searchParams,setSearchParams] = useSearchParams()
    const userModal = searchParams.get("user_m");
    return (
        <div>
            {userModal && (
                <UserModal/>
            )}
        </div>
    )
}