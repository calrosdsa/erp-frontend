import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { GlobalState } from "~/types/app-types"
import { usePermission } from "~/util/hooks/useActions"
import { DataTable } from "@/components/custom/table/CustomTable"
import { addressColumns } from "@/components/custom/table/columns/address/address-columms"
import { route } from "~/util/route"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"



export default function AddressesClient(){
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const globalState = useOutletContext<GlobalState>()
    const [permission] = usePermission({
        roleActions:globalState.roleActions,
        actions:actions
    })
    const r = route
    const navigate = useNavigate()
    setUpToolbar(()=>{
        return {
            ...(permission?.create && {
                addNew:()=>{
                    navigate(r.toRoute({
                        main:r.address,
                        routeSufix:["new"]
                    }))
                }
            })
        }
    },[permission])
    return (
        <div>
            <DataTable
            data={paginationResult || []}
            columns={addressColumns()}
            enableSizeSelection={true}

            />
        </div>
    )
}