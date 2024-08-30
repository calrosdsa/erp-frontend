import Typography, { title } from "@/components/typography/Typography";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemPriceColumns } from "@/components/custom/table/columns/stock/itemPriceColumns";
import useActionRow from "~/util/hooks/useActionTable";
import AddItemPrice, { useAddItemPrice } from "../home.stock.item-prices_/components/add-item-price";
import { components } from "~/sdk";
import { ItemGlobalState } from "~/types/app";
import { loader } from "./route";

export default function ItemDetailPricesClient() {
  const {item} = useOutletContext<ItemGlobalState>()
  const { t } = useTranslation("common");
  const { itemPrices } = useLoaderData<typeof loader>();
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
        <Typography fontSize={title}>{t("item.prices")}</Typography>
      </div>

      <div className="mt-3">
        {/* {JSON.stringify(itemPrices)} */}
        <DataTable
          data={itemPrices?.pagination_result.results || []}
          columns={itemPriceColumns({})}
          hiddenColumns={{
            Currency: false,
          }}
          metaActions={{
            meta:{
              addNew:()=>{
                addItemPrice.onOpenDialog({item:item})
              }
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
