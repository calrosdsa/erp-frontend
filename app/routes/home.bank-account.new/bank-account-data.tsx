import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import SelectForm from "@/components/custom/select/SelectForm";
import { Typography } from "@/components/typography";
import { Form } from "@/components/ui/form";
import { FetcherWithComponents, useOutletContext } from "@remix-run/react";
import { MutableRefObject } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BankAccountType } from "~/util/data/schemas/accounting/bank-account.schema";
import { BankForm } from "~/util/hooks/fetchers/accounting/use-bank-fetcher";
import { route } from "~/util/route";
import { PartyAutocompleteField } from "../home.order.$partyOrder.new/components/party-autocomplete";
import { GlobalState } from "~/types/app";
import { LedgerAutocompleteFormField } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";

const accountTypes = [
  "Cuenta de Ahorro",
  "Cuenta Corriente",
  "Cuenta Conjunta",
];
export default function BankAccountData({
  fetcher,
  form,
  onSubmit,
  inputRef,
  allowEdit = true,
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<BankAccountType>;
  onSubmit: (e: BankAccountType) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
}) {
  const { t } = useTranslation("common");
  const formValues = form.getValues();
  const { roleActions } = useOutletContext<GlobalState>();
  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"gap-y-3 grid p-3"}
        >
          {/* {JSON.stringify(form.formState.errors)} */}
          <div className="create-grid">
            <CustomFormFieldInput
              control={form.control}
              name="account_name"
              label={t("form.name")}
              inputType="input"
              allowEdit={allowEdit}
              required={true}
            />

            <SelectForm
              control={form.control}
              data={accountTypes.map(
                (t) =>
                  ({
                    value: t,
                    name: t,
                  } as SelectItem)
              )}
              keyName="name"
              keyValue="value"
              label="Tipo de Cuenta"
              name={"bank_account_type"}
            />

            <BankForm
              control={form.control}
              allowEdit={allowEdit}
              label={t("bank")}
              href={
                formValues.bank
                  ? route.toRoute({
                      main: route.bank,
                      routeSufix: [formValues.bank.name || ""],
                      q: {
                        tab: "info",
                        id: formValues.bank.uuid,
                      },
                    })
                  : undefined
              }
            />

            <CustomFormFieldInput
              control={form.control}
              name="is_company_account"
              label={"Es la Cuenta de la Empresa"}
              inputType="check"
              allowEdit={allowEdit}
            />

            {formValues.is_company_account && (
              <LedgerAutocompleteFormField
                control={form.control}
                label={"Cuenta de La Empresa"}
                name="company_account"
                allowEdit={allowEdit}
                required={true}
              />
            )}

            <div className="col-span-full" />
            {!formValues.is_company_account && (
              <>
                <Typography variant="subtitle2" className=" col-span-full">
                  Detalles de la entidad
                </Typography>
                <SelectForm
                  form={form}
                  data={route.p.paymentOptions}
                  allowEdit={allowEdit}
                  label={t("form.partyType")}
                  keyName={"name"}
                  onValueChange={() => {
                    form.trigger("partyType");
                  }}
                  keyValue={"value"}
                  name="partyType"
                />

                {formValues.partyType && (
                  <div>
                    <PartyAutocompleteField
                      control={form.control}
                      partyType={formValues.partyType}
                      allowEdit={allowEdit}
                      roleActions={roleActions}
                    />
                  </div>
                )}
              </>
            )}

            <div className="col-span-full" />
            <Typography variant="subtitle2" className=" col-span-full">
              Detalles de la Cuenta
            </Typography>

            <CustomFormFieldInput
              control={form.control}
              name="iban"
              label={"IBAN"}
              inputType="input"
              allowEdit={allowEdit}
            />
            <CustomFormFieldInput
              control={form.control}
              name="branch_code"
              label={"Código de Rama"}
              inputType="input"
              allowEdit={allowEdit}
            />
            <CustomFormFieldInput
              control={form.control}
              name="bank_account_number"
              label={"Número de Cuenta Bancaria"}
              inputType="input"
              allowEdit={allowEdit}
            />
          </div>

          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
