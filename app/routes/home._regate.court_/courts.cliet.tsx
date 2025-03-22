import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import Court, { loader } from "./route"
import { GlobalState } from "~/types/app-types"
import { usePermission } from "~/util/hooks/useActions"
import { DataTable } from "@/components/custom/table/CustomTable"
import { courtColumns } from "@/components/custom/table/columns/regate/court-columns"
import { route } from "~/util/route"
import { useEffect } from "react"
import { useToolbar } from "~/util/hooks/ui/useToolbar"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"


export default function CourtClient(){
    const globalState = useOutletContext<GlobalState>()
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const r = route
    const navigate = useNavigate()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })

    setUpToolbar(()=>{
        return {
            titleToolbar:"Canchas",
            ...(permission?.create && {
                addNew:()=>{
                    navigate(r.toCreateCourt())
                }
            })
        }
    },[permission])
    return (
        <div>
            <DataTable
            data={paginationResult?.results || []}
            columns={courtColumns()}
            enableSizeSelection={true}
            paginationOptions={{
                rowCount:paginationResult?.total
            }}
            />
        </div>
    )
}