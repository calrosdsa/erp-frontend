import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { accountColumns } from "@/components/custom/table/columns/accounting/account-columns"
import { GlobalState } from "~/types/app-types"
import { usePermission } from "~/util/hooks/useActions"
import { route } from "~/util/route"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"
import { TreeView } from "@/components/layout/tree/tree-view"


export default function WarehouseTreeViewClient(){
    const globalState = useOutletContext<GlobalState>()
    const {data,actions} = useLoaderData<typeof loader>()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    const r = route
    const navigate = useNavigate()
    setUpToolbar(()=>{
        return {
            ...(permission?.create && {
                addNew:()=>{
                }
            })
        }
    },[permission])
    return (
        <div>
            <TreeView
            data={data||[]}
            />    
        </div>
    )
}