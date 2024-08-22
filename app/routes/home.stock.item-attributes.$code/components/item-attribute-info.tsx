import { useLoaderData, useRevalidator } from "@remix-run/react";
import { loader } from "../route";
import Typography, { title } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { z } from "zod";
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemAttributeValuesColumns } from "@/components/custom/table/columns/stock/item-attribute-columns";
import useActionTable from "~/util/hooks/useActionTable";
import UpsertItemAttributeValue from "./upsert-item-attribute-value";
import { useEffect, useState } from "react";
import { components } from "~/sdk";

export default function ItemAttributeInfo() {
  const { itemAttribute } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const [meta, stateActions] = useActionTable({
    onEdit:indexRow=>{
      if (indexRow != undefined) {
        const item = itemAttribute?.ItemAttributeValues.find(
          (t, index) => index == indexRow
        );
        console.log(item)
        if (item) {
          setSelectedItemAttributeValue(item)
        }
      }
    }
  });
  const { openDialog, setOpenDialog } = stateActions;
  const revalidator = useRevalidator()

  const [selectedItemAttributeValue, setSelectedItemAttributeValue] = useState<
    components["schemas"]["ItemAttributeValue"] | undefined
  >(undefined);

  return (
    <>
      {openDialog && itemAttribute && (
        <UpsertItemAttributeValue
        itemAttributeValue={selectedItemAttributeValue}
          open={openDialog}
          itemAttribute={itemAttribute}
          close={() => setOpenDialog(false)}
          title={t("_stock.addItemAttributeValue")}
        />
      )}
      <div className="info-grid">
        <div className=" col-span-full">
          <Typography fontSize={title}>
            {t("_stock.itemAttributeInfo")}
          </Typography>
        </div>
        <DisplayTextValue title={t("form.name")} value={itemAttribute?.Name} />

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
              meta: meta,
            }}
          />
        </div>
      </div>
    </>
  );
}
