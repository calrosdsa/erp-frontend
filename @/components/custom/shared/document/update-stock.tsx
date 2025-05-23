"use client";

import { UseFormReturn } from "react-hook-form";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import CustomFormField from "../../form/CustomFormField";
import { CustomCheckbox } from "../../input/CustomCheckBox";
import FormAutocomplete from "../../select/FormAutocomplete";
import { useTranslation } from "react-i18next";
import { useWarehouseDebounceFetcher, WarehouseAutocompleteFormField } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import { useMemo } from "react";
import FormAutocompleteField from "../../select/form-autocomplete";
import CustomFormFieldInput from "../../form/CustomFormInput";

interface UpdateStockProps {
  form: UseFormReturn<any>;
  updateStock?: boolean;
  partyType: string;
  isInvoice?: boolean;
  allowEdit?:boolean
}

export default function UpdateStock({
  form,
  updateStock,
  partyType,
  isInvoice = false,
  allowEdit,
}: UpdateStockProps) {
  const { t } = useTranslation("common");
  const isSaleInvoice = partyType === partyTypeToJSON(PartyType.saleInvoice);
  const isPurchaseInvoice =
    partyType === partyTypeToJSON(PartyType.purchaseInvoice);
  const isPurchaseReceipt =
    partyType === partyTypeToJSON(PartyType.purchaseReceipt);
  const isDeliveryNote = partyType === partyTypeToJSON(PartyType.deliveryNote);


  return (
    <>
      {isInvoice && (
        <CustomFormField form={form.control} name="updateStock">
          {(field) => (
            <CustomFormFieldInput
              allowEdit={allowEdit}
              label={t("form.updateStock")}
              name="updateStock" 
              inputType={"check"}
            />
            // <CustomCheckbox
            //   checked={field.value}
            //   allowEdit={allowEdit}
            //   onCheckedChange={(e) => {
            //     field.onChange(e);
            //     form.trigger("updateStock");
            //   }}
            // />
          )}
        </CustomFormField>
      )}
      {((updateStock && isSaleInvoice) || isDeliveryNote) && (
        <WarehouseAutocompleteFormField
          form={form}
          label={t("f.source", { o: t("_warehouse.base") })}
          isGroup={false}
          allowEdit={allowEdit}
        />
      )}

      {((updateStock && isPurchaseInvoice) || isPurchaseReceipt) && (
        <>
        <WarehouseAutocompleteFormField
          form={form}
          label={t("warehouse")}
          isGroup={false}
          allowEdit={allowEdit}
        />
          {/* <FormAutocomplete
            control={form.control}
            data={acceptedWarehouse.data?.warehouses || []}
            name="acceptedWarehouseName"
            nameK="name"
            onValueChange={onAcceptedWarehouseChange}
            onSelect={(v) => {
              form.setValue("acceptedWarehouseID", v.id);
            }}
            label={t("warehouse")}
          /> */}
          {/* <FormAutocomplete
            control={form.control}
            data={rejectedWarehouse.data?.warehouses || []}
            name="rejectedWarehouseName"
            nameK="name"
            onValueChange={onRejectedWarehouseChange}
            onSelect={(v) => {
              form.setValue("rejectedWarehouseID", v.id);
            }}
            label={t("f.rejected", { o: t("warehouse") })}
          /> */}
        </>
      )}
    </>
  );
}
