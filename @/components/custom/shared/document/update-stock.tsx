"use client";

import { UseFormReturn } from "react-hook-form";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import CustomFormField from "../../form/CustomFormField";
import { CustomCheckbox } from "../../input/CustomCheckBox";
import FormAutocomplete from "../../select/FormAutocomplete";
import { useTranslation } from "react-i18next";
import { useWarehouseDebounceFetcher, WarehouseAutocompleteFormField } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import { useMemo } from "react";
import FormAutocompleteField from "../../select/FormAutocompleteField";

interface UpdateStockProps {
  form: UseFormReturn<any>;
  updateStock?: boolean;
  partyType: string;
  isInvoice?: boolean;
}

export default function UpdateStock({
  form,
  updateStock,
  partyType,
  isInvoice = false,
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
            <CustomCheckbox
              checked={field.value}
              onCheckedChange={(e) => {
                field.onChange(e);
                form.trigger("updateStock");
              }}
              label={t("form.updateStock")}
            />
          )}
        </CustomFormField>
      )}
      {((updateStock && isSaleInvoice) || isDeliveryNote) && (
        <WarehouseAutocompleteFormField
          control={form.control}
          label={t("f.source", { o: t("_warehouse.base") })}
          isGroup={false}
        />
      )}

      {((updateStock && isPurchaseInvoice) || isPurchaseReceipt) && (
        <>
        <WarehouseAutocompleteFormField
          control={form.control}
          label={t("warehouse")}
          isGroup={false}
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
