import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { accountColumns } from "@/components/custom/table/columns/accounting/account-columns"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { routes } from "~/util/route"


export default function AccountsClient(){
    const globalState = useOutletContext<GlobalState>()
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    const r = routes
    const navigate = useNavigate()
    return (
        <div>
            <DataTable
            metaActions={{
                meta:{
                    ...(permission?.create && {
                        addNew:()=>{
                            navigate(r.toCreateAccountLedger())
                        }
                    })
                }
            }}
            data={paginationResult?.results || []}
            columns={accountColumns()}
            />
        </div>
    )
}