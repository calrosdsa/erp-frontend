import Typography, { title } from "@/components/typography/Typography";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemPriceColumns } from "@/components/custom/table/columns/stock/item-price-columns";
import useActionRow from "~/util/hooks/useActionRow";
import { ItemGlobalState } from "~/types/app";
import { loader } from "./route";
import { usePermission } from "~/util/hooks/useActions";
import { useAddItemPrice } from "../home.stock.itemPrice_/components/add-item-price";

export default function ItemDetailPricesClient() {
  const {item,globalState} = useOutletContext<ItemGlobalState>()
  const { t } = useTranslation("common");
  const { paginationResult,actions } = useLoaderData<typeof loader>();
  const [permission] = usePermission({
    actions:actions,
    roleActions:globalState.roleActions,
  })
  const addItemPrice = useAddItemPrice()

  // const [meta,state] = useActionRow({})

  return (
    <>
    {/* {state.openDialog && 
    <AddItemPrice
    open={state.openDialog}
    onOpenChange={(e)=>state.setOpenDialog(e)}
    item={item}
    />
    } */}
      <div className=" col-span-full">
        <Typography fontSize={title}>{t("_item.prices")}</Typography>
      </div>

      <div className="mt-3">
        {/* {JSON.stringify(itemPrices)} */}
        <DataTable
          data={paginationResult?.results || []}
          columns={itemPriceColumns({})}
          hiddenColumns={{
            Currency: false,
          }}
          metaActions={{
            meta:{
              ...(permission?.create && {
                addNew:()=>{
                  addItemPrice.onOpenDialog({itemUuid:item.uuid})
                }
              })
            }
          }}
          // metaOptions={{
          //   meta:meta
          // }}
        />
      </div>
    </>
  );
}
