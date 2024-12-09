import { useLoaderData, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { supplierColumns } from "@/components/custom/table/columns/buying/supplier-columns"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { useCreateSupplier } from "./components/create-supplier"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"


export default function SuppliersClient (){
    const globalState = useOutletContext<GlobalState>()
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const createSupplier = useCreateSupplier()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })


    setUpToolbar(()=>{    
        return {
            ...(permission?.create && {
                addNew:()=>{
                    createSupplier.openDialog({})
                }
            })
        }
    },[permission])
    return (
        <div>
            <DataTable
            data={paginationResult?.results || []}
            columns={supplierColumns({})}
            />
        </div>
    )
}