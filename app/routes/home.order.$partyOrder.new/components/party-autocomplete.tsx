import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import FormAutocompleteField from "@/components/custom/select/form-autocomplete";
import { Control, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { useCreateSupplier } from "~/routes/home.supplier_/components/create-supplier";
import { useCreateCustomer } from "~/routes/home.customer_/components/create-customer";
import { components } from "~/sdk";
import { GlobalState } from "~/types/app-types";
import { orderDataSchema } from "~/util/data/schemas/buying/order-schema";
import {
  CustomerAutoCompleteForm,
  CustomerSearch,
  useCustomerDebounceFetcher,
} from "~/util/hooks/fetchers/useCustomerDebounceFetcher";
import {
  SupplierAutoCompleteForm,
  SupplierSearch,
  useSupplierDebounceFetcher,
} from "~/util/hooks/fetchers/use-supplier-fetcher";
import { usePermission } from "~/util/hooks/useActions";
import { party } from "~/util/party";
import { useSearchParams } from "@remix-run/react";
import { route } from "~/util/route";
import { CREATE, DEFAULT_ID } from "~/constant";
import { OpenModalFunc } from "~/types";
import { useModalNav } from "~/util/hooks/app/use-open-modal";


export const PartyAutocompleteField = ({
  partyType,
  roleActions,
  form,
  allowEdit,
  openModal,
}: {
  partyType: string;
  allowEdit?: boolean;
  form: any;
  roleActions: components["schemas"]["RoleActionDto"][];
  openModal: OpenModalFunc;
}) => {
  const { t } = useTranslation("common");
  const p = party;
  const formValues = form.getValues();
  return (
    <>
      {(partyType == p.purchaseOrder ||
        partyType == p.purchaseInvoice ||
        partyType == p.supplier ||
        partyType == p.purchaseReceipt ||
        partyType == p.supplierQuotation) && (
        <>
          <SupplierAutoCompleteForm
            required={true}
            form={form}
            name="party"
            allowEdit={allowEdit}
            label={t("supplier")}
            openModal={openModal}
            roleActions={roleActions}
            // navigate={()=>}
            {...(formValues.party?.id && {
              navigate: () => {
                openModal(route.supplier, formValues.party.id);
              },
            })}
          />
        </>
      )}

      {(partyType == p.saleOrder ||
        partyType == p.saleInvoice ||
        partyType == p.deliveryNote ||
        partyType == p.customer ||
        partyType == p.salesQuotation) && (
        <CustomerAutoCompleteForm
          required={true}
          form={form}
          name="party"
          label={t("customer")}
          allowEdit={allowEdit}
          openModal={openModal}
          roleActions={roleActions}
          {...(formValues.party?.id && {
            navigate: () => {
              openModal(route.customer, formValues.party.id);
            },
          })}
        />
      )}
    </>
  );
};

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
