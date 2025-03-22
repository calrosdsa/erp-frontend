import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import FormAutocompleteField from "@/components/custom/select/FormAutocompleteField";
import { Control, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { useCreateSupplier } from "~/routes/home.buying.supplier_/components/create-supplier";
import { useCreateCustomer } from "~/routes/home.selling.customer_/components/create-customer";
import { components } from "~/sdk";
import { GlobalState } from "~/types/app-types";
import { orderDataSchema } from "~/util/data/schemas/buying/order-schema";
import {
  CustomerSearch,
  useCustomerDebounceFetcher,
} from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import {
  SupplierSearch,
  useSupplierDebounceFetcher,
} from "~/util/hooks/fetchers/useSupplierDebounceFetcher";
import { usePermission } from "~/util/hooks/useActions";
import { party } from "~/util/party";

export default function PartyAutocomplete({
  party,
  form,
  roleActions,
  allowEdit,
}: {
  party: string;
  form: UseFormReturn<any>;
  allowEdit?: boolean;
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
        party == partyTypeToJSON(PartyType.supplierQuotation)) && (
        <FormAutocomplete
          required={true}
          data={supplierDebounceFetcher.data?.suppliers || []}
          form={form}
          name="partyName"
          nameK={"name"}
          allowEdit={allowEdit}
          onValueChange={onSupplierChange}
          label={t("supplier")}
          onSelect={(v) => {
            // form.setValue("partyUuid", v.uuid);
            form.setValue("partyID", v.id);
            // form.setValue("partyType", partyTypeToJSON(PartyType.supplier));
            form.trigger("partyID");
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
        party == partyTypeToJSON(PartyType.salesQuotation)) && (
        <FormAutocomplete
          required={true}
          data={customerFetcher.data?.customers || []}
          form={form}
          name="partyName"
          nameK={"name"}
          onValueChange={onCustomerChange}
          label={t("customer")}
          allowEdit={allowEdit}
          onSelect={(v) => {
            // form.setValue("partyUuid", v.uuid);
            form.setValue("partyID", v.id);
            // form.setValue("partyType", partyTypeToJSON(PartyType.customer));
            form.trigger("partyID");
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

export const PartyAutocompleteField= ({
  partyType,
  control,
  roleActions,
  allowEdit,
}: {
  partyType: string;
  control: Control<any,any>;
  allowEdit?: boolean;
  roleActions: components["schemas"]["RoleActionDto"][];
}) => {
  const { t } = useTranslation("common");
  const [supplierDebounceFetcher, onSupplierChange] =
    useSupplierDebounceFetcher();
  const [customerFetcher, onCustomerChange] = useCustomerDebounceFetcher();
  const [customerPermission] = usePermission({
    actions: customerFetcher.data?.actions,
    roleActions: roleActions,
  });
  const p = party
  const createCustomer = useCreateCustomer();
  const [supplierPermission] = usePermission({
    actions: supplierDebounceFetcher.data?.actions,
    roleActions: roleActions,
  });
  const createSupplier = useCreateSupplier();

  return (
    <>
      {(partyType == p.purchaseOrder ||
        partyType == p.purchaseInvoice ||
        partyType == p.supplier ||
        partyType == p.purchaseReceipt ||
        partyType == p.supplierQuotation) && (
        <FormAutocompleteField
          required={true}
          data={supplierDebounceFetcher.data?.suppliers || []}
          control={control}
          name="party"
          nameK={"name"}
          allowEdit={allowEdit}
          onValueChange={onSupplierChange}
          label={t("supplier")}
          {...(supplierPermission?.create && {
            addNew: () => {
              createSupplier.openDialog({});
            },
          })}
        />
      )}

      {(partyType == p.saleOrder ||
        partyType == p.saleInvoice ||
        partyType == p.deliveryNote ||
        partyType == p.customer ||
        partyType == p.salesQuotation) && (
        <FormAutocompleteField
          required={true}
          data={customerFetcher.data?.customers || []}
          control={control}
          name="party"
          nameK={"name"}
          onValueChange={onCustomerChange}
          label={t("customer")}
          allowEdit={allowEdit}
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

export const PartySearch = ({ party }: { party: string }) => {
  const { t } = useTranslation("common");

  return (
    <>
      {(party == partyTypeToJSON(PartyType.purchaseOrder) ||
        party == partyTypeToJSON(PartyType.purchaseInvoice) ||
        party == partyTypeToJSON(PartyType.purchaseReceipt) ||
        party == partyTypeToJSON(PartyType.supplierQuotation)) && (
        <SupplierSearch placeholder={t("supplier")} />
      )}

      {(party == partyTypeToJSON(PartyType.saleOrder) ||
        party == partyTypeToJSON(PartyType.saleInvoice) ||
        party == partyTypeToJSON(PartyType.deliveryNote) ||
        party == partyTypeToJSON(PartyType.salesQuotation)) && (
        <CustomerSearch placeholder={t("customer")} />
      )}
    </>
  );
};
