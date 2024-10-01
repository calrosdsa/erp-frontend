import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { DataTable } from "@/components/custom/table/CustomTable"
import { invoiceColumns } from "@/components/custom/table/columns/invoice/invoice-columns"
import { routes } from "~/util/route"


export default function InvoicesClient(){
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const globalState = useOutletContext<GlobalState>()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    const navigate = useNavigate()
    const r = routes
    return (
        <div>
            <DataTable
            data={paginationResult?.results || []}
            columns={invoiceColumns()}
            metaActions={{
                meta:{
                    ...(permission?.create && {
                        addNew:()=>{
                            navigate(r.toPurchaseInvoiceCreate())
                        }
                    })
                }
            }}
            />
        </div>
    )
}