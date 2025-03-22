import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemStockColums } from "@/components/custom/table/columns/stock/item-stock-columns";
import { useUpsertItemStockLevel } from "./components/upsert-item-stock-level";
import { GlobalState, ItemGlobalState } from "~/types/app-types";
import useActionRow from "~/util/hooks/useActionRow";
import { usePermission } from "~/util/hooks/useActions";

export default function ItemStockClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const upsertItemStockLevel = useUpsertItemStockLevel();
  const { item,globalState } = useOutletContext<ItemGlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const [meta, stateActions] = useActionRow({
    onEdit: (indexRow) => {
      if (indexRow != undefined) {
        const itemStock = paginationResult?.results?.find(
          (t, index) => index == indexRow
        );
        if (itemStock) {
          upsertItemStockLevel.editStockLevel(itemStock);
        }
      }
    },
  });
  return (
    <div>
      <DataTable
        data={paginationResult?.results || []}
        columns={itemStockColums({ includeWarehouse: true })}
        hiddenColumns={{
          warehouseCode: false,
        }}
        metaActions={{
          meta: {
            ...(permission?.create && {
              addNew: () => {
                upsertItemStockLevel.onOpenDialog({ open: true, itemUuid: item.uuid });
              },
            }),
          },
        }}
        metaOptions={{
          meta: meta,
        }}
      />
    </div>
  );
}
