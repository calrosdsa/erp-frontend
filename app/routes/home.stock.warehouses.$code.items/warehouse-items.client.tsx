import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { useUpsertItemStockLevel } from "../home.stock.items.$code.stock_/components/upsert-item-stock-level";
import useActionRow from "~/util/hooks/useActionTable";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemStockColums } from "@/components/custom/table/columns/stock/item-stock-columns";
import { WarehouseGlobalState } from "~/types/app";

export default function WareHouseItemsClient(){
    const {paginationResult} = useLoaderData<typeof loader>()
    const upsertItemStockLevel = useUpsertItemStockLevel()
    const {warehouse} = useOutletContext<WarehouseGlobalState>()
    const [meta, stateActions] = useActionRow({
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
        columns={itemStockColums({includeWarehouse:false,includeItem:true})}
        hiddenColumns={{
            itemCode:false
        }}
        metaActions={{
            meta:{
                addNew:()=>{
                    upsertItemStockLevel.onOpenDialog({open:true,warehouse:warehouse})
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