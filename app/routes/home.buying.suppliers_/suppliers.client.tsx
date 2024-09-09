import { useLoaderData, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { supplierColumns } from "@/components/custom/table/columns/buying/supplier-columns"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { useCreateSupplier } from "./components/create-supplier"


export default function SuppliersClient (){
    const globalState = useOutletContext<GlobalState>()
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const createSupplier = useCreateSupplier()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    return (
        <div>
            <DataTable
            data={paginationResult?.results || []}
            columns={supplierColumns({})}
            metaActions={{
                meta:{
                    ...(permission?.create && {
                        addNew:()=>{
                            createSupplier.openDialog({})
                        }
                    })
                }
            }}
            />
        </div>
    )
}