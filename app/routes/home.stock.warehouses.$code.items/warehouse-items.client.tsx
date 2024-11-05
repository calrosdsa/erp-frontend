import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import useActionRow from "~/util/hooks/useActionRow";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemStockColums } from "@/components/custom/table/columns/stock/item-stock-columns";
import { WarehouseGlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { useUpsertItemStockLevel } from "../home.stock.item.$code.stock_/components/upsert-item-stock-level";

export default function WareHouseItemsClient(){
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const upsertItemStockLevel = useUpsertItemStockLevel()
    const {warehouse,globalState} = useOutletContext<WarehouseGlobalState>()
    const [itemStockPermission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })

    const [meta, stateActions] = useActionRow({
        onEdit:indexRow=>{
          if (indexRow != undefined) {
            const itemStock = paginationResult?.results?.find(
                (t, index) => index == indexRow
              );
              if(itemStock){
                itemStock.warehouse_uuid = warehouse.uuid
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
                ...(itemStockPermission?.create && {
                    addNew:()=>{
                        upsertItemStockLevel.onOpenDialog({open:true,warehouseUuid:warehouse.uuid})
                    }
                })
            }
        }}
        metaOptions={{
            meta:meta
        }}
        />
    </div>
    )
}