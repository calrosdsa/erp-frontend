import { useLoaderData, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { itemStockColums } from "@/components/custom/table/columns/stock/item-stock-columns"
import { useUpsertItemStockLevel } from "./components/add-item-stock-level"
import { ItemGlobalState } from "~/types/app"
import useActionTable from "~/util/hooks/useActionTable"


export default function ItemStockClient(){
    const {paginationResult} = useLoaderData<typeof loader>()
    const upsertItemStockLevel = useUpsertItemStockLevel()
    const {item} = useOutletContext<ItemGlobalState>()
    const [meta, stateActions] = useActionTable({
        onEdit:indexRow=>{
          if (indexRow != undefined) {
            const itemStock = paginationResult?.results?.find(
                (t, index) => index == indexRow
              );
              if(itemStock){
                upsertItemStockLevel.editStockLevel(itemStock)
              }
          }
        }
      });
    return (
        <div>
            <DataTable
            data={paginationResult?.results || []}
            columns={itemStockColums()}
            hiddenColumns={{
                warehouseCode:false
            }}
            metaActions={{
                meta:{
                    addNew:()=>{
                        upsertItemStockLevel.onOpenDialog(true,item)
                    }
                }
            }}
            metaOptions={{
                meta:meta
            }}
            />
        </div>
    )
}