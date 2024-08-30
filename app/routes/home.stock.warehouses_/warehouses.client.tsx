import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { warehouseColumns } from "@/components/custom/table/columns/stock/warehouse-columns"
import { useCreateWareHouse } from "./components/add-warehouse"

export default function WareHousesClient(){
    const {paginationResult} = useLoaderData<typeof loader>()
    const createWareHouse = useCreateWareHouse()
    return (
        <>

            <DataTable
            data={paginationResult?.results || []}
            columns={warehouseColumns()}
            metaActions={{
                meta:{
                    addNew:()=>{
                        createWareHouse.openDialog({})
                    }
                }
            }}
            />
        </>
    )
}