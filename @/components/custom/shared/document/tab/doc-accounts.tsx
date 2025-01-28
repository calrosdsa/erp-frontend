import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { useFetcher, useOutletContext } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { action } from "~/routes/api.document/route";
import { GlobalState } from "~/types/app";
import {
  AddressAndContactDataType,
  addressAndContactSchema,
} from "~/util/data/schemas/document/address-and-contact.schema";
import {
  docAccountsSchema,
  DocAccountsType,
} from "~/util/data/schemas/document/doc-accounts.schema";
import { AddressAutoCompleteForm } from "~/util/hooks/fetchers/core/use-address-fetcher";
import { LedgerAutocompleteForm } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useEditFields } from "~/util/hooks/useEditFields";
import { route } from "~/util/route";

export default function DocAccounts({
  defaultValues,
  allowEdit,
  showPayableAccount,
  showCogsAccount,
  showReceivableAccount,
  showIncomeAccount,
  showInventoryAccount,
  showSrbnb,
}: {
  defaultValues: DocAccountsType;
  showPayableAccount?: boolean;
  showCogsAccount?: boolean;
  showReceivableAccount?: boolean;
  showIncomeAccount?: boolean;
  showInventoryAccount?: boolean;
  showSrbnb?: boolean;
  allowEdit: boolean;
}) {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef, previousValues } =
    useEditFields<DocAccountsType>({
      schema: docAccountsSchema,
      defaultValues: defaultValues,
    });
  const { setRegister } = useSetupToolbarStore();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const r = route;
  const onSubmit = (e: DocAccountsType) => {
    fetcher.submit(
      {
        docAccountsData: e,
        action: "edit-doc-accounts",
      },
      {
        method: "POST",
        action: r.apiDocument,
        encType: "application/json",
      }
    );
  };

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        updateRef(form.getValues());
      },
    },
    [fetcher.data]
  );

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  useEffect(() => {
    setRegister("tab", {
      onSave: () => {
        console.log("ON SAVE ADDRESS AND CONTACT");
        inputRef.current?.click();
      },
      disabledSave: !allowEdit,
    });
  }, [allowEdit]);

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"gap-y-3 grid p-3"}
        >
          <div className="create-grid">
            {showPayableAccount && (
              <LedgerAutocompleteForm
                allowEdit={allowEdit}
                control={form.control}
                name="payable_account"
                label="Cuenta por Pagar"
                onClear={() => {
                  form.setValue("payable_account_id", null);
                  form.setValue("payable_account", null);
                }}
                onSelect={(e) => {
                  form.setValue("payable_account_id", e.id);
                }}
              />
            )}
            {showCogsAccount && (
              <LedgerAutocompleteForm
                allowEdit={allowEdit}
                control={form.control}
                name="cogs_account"
                label="Cuenta de Costo de Bienes Vendidos"
                onClear={() => {
                  form.setValue("cogs_account_id", null);
                  form.setValue("cogs_account", null);
                }}
                onSelect={(e) => {
                  form.setValue("cogs_account_id", e.id);
                }}
              />
            )}
            {showReceivableAccount && (
              <LedgerAutocompleteForm
                allowEdit={allowEdit}
                control={form.control}
                name="cogs_account"
                label="Cuenta por Cobrar"
                onClear={() => {
                  form.setValue("receivable_account_id", null);
                  form.setValue("receivable_account", null);
                }}
                onSelect={(e) => {
                  form.setValue("receivable_account_id", e.id);
                }}
              />
            )}

          

            {showIncomeAccount && (
              <LedgerAutocompleteForm
                allowEdit={allowEdit}
                control={form.control}
                name="income_account"
                label="Cuenta por Cobrar"
                onClear={() => {
                  form.setValue("income_account_id", null);
                  form.setValue("income_account", null);
                }}
                onSelect={(e) => {
                  form.setValue("income_account_id", e.id);
                }}
              />
            )}

            {showInventoryAccount && (
              <LedgerAutocompleteForm
                allowEdit={allowEdit}
                control={form.control}
                name="inventory_account"
                label="Cuenta de Inventario"
                onClear={() => {
                  form.setValue("inventory_account_id", null);
                  form.setValue("inventory_account", null);
                }}
                onSelect={(e) => {
                  form.setValue("inventory_account_id", e.id);
                }}
              />
            )}

            {showSrbnb && (
              <LedgerAutocompleteForm
                allowEdit={allowEdit}
                control={form.control}
                name="srbnb_account"
                label="Cuenta Transitoria"
                onClear={() => {
                  form.setValue("srbnb_account_id", null);
                  form.setValue("srbnb_account", null);
                }}
                onSelect={(e) => {
                  form.setValue("srbnb_account_id", e.id);
                }}
              />
            )}
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
