import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { action } from "~/routes/api.document/route";
import { Permission } from "~/types/permission";
import { FieldNullType } from "~/util/data/schemas";
import { docAccountsSchema, DocAccountsType } from "~/util/data/schemas/document/doc-accounts.schema";
import { LedgerAutocompleteFormField } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { useLoadingTypeToolbar, useSetupToolbarStore } from "~/util/hooks/ui/useSetUpToolbar";
import { useEditFields } from "~/util/hooks/useEditFields";
import { route } from "~/util/route";

export default function DocAccounts({
  defaultValues,
  allowEdit,
  showCreditAccount,
  showDebitAccount,
  ledgerPerm,
}: {
  defaultValues: DocAccountsType;
  showCreditAccount?: boolean;
  showDebitAccount?: boolean;

  allowEdit: boolean;
  ledgerPerm?: Permission;
}) {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef, previousValues } = useEditFields<DocAccountsType>({
    schema: docAccountsSchema,
    defaultValues: defaultValues,
  });
  const navigate = useNavigate();
  const { setRegister } = useSetupToolbarStore();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const r = route;
  const formValues = form.getValues();
  const fieldsConfig = [
    {
      show: showCreditAccount,
      name: "credit_account",
      label: "Cuenta por Pagar",
    },
    {
      show: showDebitAccount,
      name: "debit_account",
      label: "Cuenta de Costo de Bienes Vendidos",
    },
    // {
    //   show: showReceivableAccount,
    //   name: "receivable_account",
    //   label: "Cuenta por Cobrar",
    // },
    // {
    //   show: showIncomeAccount,
    //   name: "income_account",
    //   label: "Cuenta por Cobrar",
    // },
    // {
    //   show: showInventoryAccount,
    //   name: "inventory_account",
    //   label: "Cuenta de Inventario",
    // },
    // {
    //   show: showSrbnb,
    //   name: "srbnb_account",
    //   label: "Cuenta Transitoria",
    // },
  ];

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
      onSuccessMessage: () => updateRef(form.getValues()),
    },
    [fetcher.data]
  );

  useLoadingTypeToolbar(
    { loading: fetcher.state == "submitting", loadingType: "SAVE" },
    [fetcher.state]
  );

  useEffect(() => {
    setRegister("tab", {
      onSave: () => inputRef.current?.click(),
      disabledSave: !allowEdit,
    });
  }, [allowEdit]);

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)} className={"gap-y-3 grid p-3"}>
          <div className="create-grid">
            {fieldsConfig.map(({ show, name, label }) =>
              show ? (
                <LedgerAutocompleteFormField
                  key={name}
                  allowEdit={allowEdit}
                  control={form.control}
                  name={name}
                  label={label}
                  {...(ledgerPerm?.create && {
                    addNew: () => navigate(r.toRoute({ main: r.ledger, routeSufix: ["new"] })),
                  })}
                  {...(ledgerPerm?.view && {
                    href: r.toRoute({
                      main: r.ledger,
                      routeSufix: [(formValues[name as keyof DocAccountsType] as FieldNullType)?.name || ""],
                      q: { 
                        tab: "info", 
                        id: (formValues[name as keyof DocAccountsType] as FieldNullType)?.uuid || "" 
                      },
                    }),
                  })}
                />
              ) : null
            )}
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}