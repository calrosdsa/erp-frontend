import Typography, { title } from "@/components/typography/Typography";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "../route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemPriceColumns } from "@/components/custom/table/columns/stock/itemPriceColumns";



export default  function ItemPrices({
    
}:{

}){
    const {t} = useTranslation("common")
  const { itemPrices } = useLoaderData<typeof loader>();

    return (
        <div>
            <div className=" col-span-full">    
          <Typography fontSize={title}>{t("item.prices")}</Typography>
        </div>

        <div className="mt-3">
            <DataTable
            data={itemPrices?.pagination_result.results || []}
            columns={itemPriceColumns({})}
            hiddenColumns={{
                'Currency':false,
            }}

            />
        </div>

        </div>
    )
}