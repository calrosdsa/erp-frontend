import { useLoaderData } from "@remix-run/react";
import { loader } from "../route";
import Typography, { title } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { z } from "zod";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemAttributeValuesColumns } from "@/components/custom/table/columns/stock/item-attribute-columns";
import useActionTable from "~/util/hooks/useActionTable";
import UpsertItemAttributeValue from "./upsert-item-attribute-value";



export default function ItemAttributeInfo() {
  const { itemAttribute } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const [meta,stateActions] = useActionTable({})
  const {addRowDialog,setAddRowDialog} = stateActions
  return (
    <>
    {addRowDialog &&
    <UpsertItemAttributeValue
    open={addRowDialog}
    close={()=> setAddRowDialog(false)}
    title={t("_stock.addItemAttributeValue")}
    />
    }
    <div className="info-grid">
      <div className=" col-span-full">
        <Typography fontSize={title}>
          {t("_stock.itemAttributeInfo")}
        </Typography>
      </div>
      <DisplayTextValue
      title={t("form.name")}
      value={itemAttribute?.Name}
      />

      <div className="col-span-full">
        <Typography fontSize={title}>
            {t("_stock.itemAttributeValues")}
        </Typography>
      </div>
      <div className="col-span-full">
        <DataTable
        columns={itemAttributeValuesColumns()}
        data={itemAttribute?.ItemAttributeValues || []}
        metaOptions={{
            meta:meta
        }}
        />
      </div>


    </div>
        </>
  );
}
