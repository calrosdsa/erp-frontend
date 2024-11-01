import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { useCreateCustomer } from "~/routes/home.customer_/components/create-customer";
import { useCreateSupplier } from "~/routes/home.supplier_/components/create-supplier";
import { GlobalState } from "~/types/app";
import { createPurchaseSchema } from "~/util/data/schemas/buying/purchase-schema";
import { useCustomerDebounceFetcher } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import { useSupplierDebounceFetcher } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
import { usePermission } from "~/util/hooks/useActions";

export default function PartyAutocomplete({
  party,
  form,
  globalState,
}: {
  party: PartyType;
  form: UseFormReturn<any>;
  globalState: GlobalState;
}) {
  const { t } = useTranslation("common");
  const [supplierDebounceFetcher, onSupplierChange] =
    useSupplierDebounceFetcher();
  const [customerFetcher, onCustomerChange] = useCustomerDebounceFetcher();
  const [customerPermission] = usePermission({
    actions: customerFetcher.data?.actions,
    roleActions: globalState.roleActions,
  });
  const createCustomer = useCreateCustomer();
  const [supplierPermission] = usePermission({
    actions: supplierDebounceFetcher.data?.actions,
    roleActions: globalState.roleActions,
  });
  const createSupplier = useCreateSupplier();

  return (
    <>
      {(party == PartyType.purchaseOrder || party == PartyType.purchaseInvoice) && (
        <FormAutocomplete
          required={true}
          data={supplierDebounceFetcher.data?.suppliers || []}
          form={form}
          name="partyName"
          nameK={"name"}
          onValueChange={onSupplierChange}
          label={t("supplier")}
          onSelect={(v) => {
            form.setValue("partyUuid", v.uuid);
            form.setValue("partyType", partyTypeToJSON(PartyType.supplier));
          }}
          {...(supplierPermission?.create && {
            addNew: () => {
              createSupplier.openDialog({});
            },
          })}
        />
      )}

      {(party == PartyType.saleOrder || party == PartyType.saleInvoice) && (
        <FormAutocomplete
          required={true}
          data={customerFetcher.data?.customers || []}
          form={form}
          name="partyName"
          nameK={"name"}
          onValueChange={onCustomerChange}
          label={t("customer")}
          onSelect={(v) => {
            form.setValue("partyUuid", v.uuid);
            form.setValue("partyType", partyTypeToJSON(PartyType.customer));
          }}
          {...(customerPermission?.create && {
            addNew: () => {
              createCustomer.openDialog({});
            },
          })}
        />
      )}
    </>
  );
}
