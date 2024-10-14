import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import Court, { loader } from "./route"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { DataTable } from "@/components/custom/table/CustomTable"
import { courtColumns } from "@/components/custom/table/columns/regate/court-columns"
import { routes } from "~/util/route"
import { useEffect } from "react"
import { useToolbar } from "~/util/hooks/ui/useToolbar"


export default function CourtClient(){
    const globalState = useOutletContext<GlobalState>()
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const r = routes
    const navigate = useNavigate()
    const toolbar =  useToolbar()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    useEffect(()=>{
        toolbar.resetState()
    },[])
    return (
        <div>
            <DataTable
            metaActions={{
                meta:{
                    ...(permission?.create && {
                        addNew:()=>{
                            navigate(r.toCreateCourt())
                        }
                    })
                }
            }}
            data={paginationResult?.results || []}
            columns={courtColumns()}
            />
        </div>
    )
}