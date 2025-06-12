import {
  itemPriceColumns,
  itemPriceEditableColumns,
} from "@/components/custom/table/columns/stock/item-price-columns";
import { DataTable } from "@/components/custom/table/CustomTable";
import { useFormContext } from "@/components/form/form-provider";
import { SmartField } from "@/components/form/smart-field";
import { Typography } from "@/components/typography";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CREATE, DELETE, EDIT } from "~/constant";
import { AddressSchema } from "~/util/data/schemas/core/address.schema";
import { ItemPriceLineSchema } from "~/util/data/schemas/stock/item-price-schema";
import { ItemSchema } from "~/util/data/schemas/stock/item-schemas";
import { UomSmartField } from "~/util/hooks/fetchers/use-uom-fetcher";
import { useActionsFieldArray } from "~/util/hooks/use-actions-field-array";

export default function ItemForm() {
  const { t } = useTranslation("common");
  const { form, setIsEditing } = useFormContext<ItemSchema>();
  const formValues = form?.getValues();

  const [arrayFields, metaOptions] = useActionsFieldArray({
    control: form?.control,
    name: "itemPrices",
    onChange: () => {
      setIsEditing(true);
    },
    onRemove: (e) => removeCell(e),
    defaultValues: {
      item_id: formValues?.id || 0,
      item_name: formValues?.name || "",
      action: CREATE,
    },
  });
  const { update, remove } = arrayFields;
  const removeCell = (index: number | number[]) => {
    if (typeof index == "number") {
      const line = formValues?.itemPrices[index];
      if (line?.action == CREATE) {
        remove(index);
      } else {
        updateCell(index, "action", DELETE);
      }
    }
  };

  const lines = useMemo(() => {
    return formValues?.itemPrices?.filter((t) => t.action != DELETE) || [];
  }, [formValues?.itemPrices]);

  const updateCell = <K extends keyof ItemPriceLineSchema>(
    row: number,
    column: K,
    value: string
  ) => {
    setIsEditing(true);
    let line = formValues?.itemPrices[row];
    if (line) {
      const currentValue = line[column];
      line[column] =
        typeof currentValue === "number" ? Number(value) : (value as any);
      // form.setValue(`sections.${row}`, line)
      update(row, line);
      if (line.id && line.action != "") {
        line["action"] = EDIT;
      }
    }
  };
  return (
    <>
      <div className="grid grid-cols-10  gap-3">
        <div className=" col-span-3 grid card gap-3">
          <SmartField name="name" label={t("form.name")} required />
          <UomSmartField modal={true} />

          <SmartField name="pn" label={t("form.code")} />
          <SmartField
            name="maintainStock"
            label={"Mantener Stock"}
            required
            type="checkbox"
          />
          <SmartField
            name="description"
            label={t("form.description")}
            type="textarea"
          />

          <Typography className=" col-span-full" variant="subtitle2">
            Configuración de Inventario
          </Typography>
          <SmartField name="shelfLifeInDays" label={"Vida útil en días"} />
          <SmartField
            name="warrantyPeriodInDays"
            label={"Período de garantía en días"}
          />
          <SmartField name="hasSerialNo" label={"Tiene número de serie"} />
          {formValues?.hasSerialNo && (
            <SmartField
              name="serialNoTemplate"
              label={"Número de serie de plantilla"}
            />
          )}
          <UomSmartField
            name="weightUom"
            label="Unidad de medidad de  peso"
            modal={true}
          />
          <SmartField name="weightPerUnit" label={"Peso por unidad"} />

          {/* <SmartField name="province" label={t("form.province")} />
        <SmartField name="company" label={t("form.company")} />
        <SmartField name="postalCode" label={t("form.postalCode")} />
        <SmartField
          name="identificationNumber"
          label={t("form.identificationNumber")}
        />
        <SmartField name="email" label={t("form.email")} />
        <SmartField name="phoneNumber" label={t("form.phoneNumber")} /> */}
        </div>

        <div className=" col-span-7 grid card gap-3 h-min">
          <Typography className=" col-span-full" variant="subtitle2">
            Precio de los Artículos
          </Typography>
          {/* {JSON.stringify(lines)} */}
          <div className="col-span-full">
            <DataTable
              // data={formValues?.itemPrices || []}
              data={lines}
              columns={itemPriceEditableColumns()}
              metaOptions={{
                meta: {
                  ...metaOptions,
                  updateCell: updateCell,
                  // disableEdit:disableEdit,
                },
              }}
            />
            {/* <DataTable
              data={formValues?.itemPrices || []}
              columns={journalEntryLineColumns({
                allowEdit: isEditing,
              })}
              metaOptions={{
                meta: {
                  ...metaOptions,
                  updateCell: updateCell,
                  disableEdit: disableEdit,
                },
              }}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}
