import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { useCreateSupplier } from "~/routes/home.buying.supplier_/components/create-supplier";
import { useCreateCustomer } from "~/routes/home.selling.customer_/components/create-customer";
import { components } from "~/sdk";
import { GlobalState } from "~/types/app";
import { createPurchaseSchema } from "~/util/data/schemas/buying/purchase-schema";
import { useCustomerDebounceFetcher } from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import { useSupplierDebounceFetcher } from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
import { usePermission } from "~/util/hooks/useActions";

export default function PartyAutocomplete({
  party,
  form,
  roleActions,
}: {
  party: string;
  form: UseFormReturn<any>;
  roleActions: components["schemas"]["RoleActionDto"][];
}) {
  const { t } = useTranslation("common");
  const [supplierDebounceFetcher, onSupplierChange] =
    useSupplierDebounceFetcher();
  const [customerFetcher, onCustomerChange] = useCustomerDebounceFetcher();
  const [customerPermission] = usePermission({
    actions: customerFetcher.data?.actions,
    roleActions: roleActions,
  });
  const createCustomer = useCreateCustomer();
  const [supplierPermission] = usePermission({
    actions: supplierDebounceFetcher.data?.actions,
    roleActions: roleActions,
  });
  const createSupplier = useCreateSupplier();

  return (
    <>
      {(party == partyTypeToJSON(PartyType.purchaseOrder) ||
        party == partyTypeToJSON(PartyType.purchaseInvoice) ||
        party == partyTypeToJSON(PartyType.purchaseReceipt) || 
        party == partyTypeToJSON(PartyType.supplierQuotation)
      ) && (
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
            form.setValue("partyID", v.id);
            form.setValue("partyType", partyTypeToJSON(PartyType.supplier));
          }}
          {...(supplierPermission?.create && {
            addNew: () => {
              createSupplier.openDialog({});
            },
          })}
        />
      )}

      {(party == partyTypeToJSON(PartyType.saleOrder) ||
        party == partyTypeToJSON(PartyType.saleInvoice) || 
        party == partyTypeToJSON(PartyType.deliveryNote) ||
        party == partyTypeToJSON(PartyType.quotation)
      ) && (
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
            form.setValue("partyID", v.id);
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
