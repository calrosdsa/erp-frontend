import Typography, { title } from "@/components/typography/Typography";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "../route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemPriceColumns } from "@/components/custom/table/columns/stock/itemPriceColumns";
import useActionTable from "~/util/hooks/useActionTable";
import AddItemPrice from "./dialog/AddItemPrice";
import { components } from "~/sdk";

export default function ItemPrices({item}: {
  item:components["schemas"]["Item"]
}) {
  const { t } = useTranslation("common");
  const { itemPrices } = useLoaderData<typeof loader>();
  const [meta,state] = useActionTable({})

  return (
    <>
    {state.openDialog && 
    <AddItemPrice
    open={state.openDialog}
    onOpenChange={(e)=>state.setOpenDialog(e)}
    item={item}
    />
    }
      <div className=" col-span-full">
        <Typography fontSize={title}>{t("item.prices")}</Typography>
      </div>

      <div className="mt-3">
        <DataTable
          data={itemPrices?.pagination_result.results || []}
          columns={itemPriceColumns({})}
          hiddenColumns={{
            Currency: false,
          }}
          metaOptions={{
            meta:meta
          }}
        />
      </div>
    </>
  );
}
