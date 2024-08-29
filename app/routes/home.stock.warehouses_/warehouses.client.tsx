import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import useCreateWareHouse from "./components/add-warehouse"
import { DataTable } from "@/components/custom/table/CustomTable"
import { warehouseColumns } from "@/components/custom/table/columns/stock/warehouse-columns"

export default function WareHousesClient(){
    const {paginationResult} = useLoaderData<typeof loader>()
    const [createWareHousedialog,setOpenDialog] = useCreateWareHouse()
    return (
        <>

            {createWareHousedialog}
            <DataTable
            data={paginationResult?.results || []}
            columns={warehouseColumns()}
            metaActions={{
                meta:{
                    addNew:()=>{
                        setOpenDialog(true)
                    }
                }
            }}
            />
        </>
    )
}