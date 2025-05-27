import { useFormContext } from "@/components/form/form-provider";
import { SmartField } from "@/components/form/smart-field";
import { Typography } from "@/components/typography";
import { useTranslation } from "react-i18next";
import { AddressSchema } from "~/util/data/schemas/core/address.schema";
import { ItemSchema } from "~/util/data/schemas/stock/item-schemas";
import { UomFormField, UomSmartField } from "~/util/hooks/fetchers/useUomDebounceFetcher";

export default function ItemForm() {
  const { t } = useTranslation("common");
  const { form } = useFormContext<ItemSchema>();
  const formValues = form?.getValues();

  return (
    <>
      {/* {JSON.stringify(formValues)} */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SmartField name="name" label={t("form.name")} required />
        <UomSmartField/>

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
        <UomSmartField name="weightUom"  label="Unidad de medidad de  peso"  />
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
    </>
  );
}
