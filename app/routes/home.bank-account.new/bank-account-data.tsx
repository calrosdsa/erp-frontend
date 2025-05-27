import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import SelectForm from "@/components/custom/select/SelectForm";
import { Typography } from "@/components/typography";
import { Form } from "@/components/ui/form";
import {
  FetcherWithComponents,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { MutableRefObject } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BankAccountType } from "~/util/data/schemas/accounting/bank-account.schema";
import { BankForm } from "~/util/hooks/fetchers/accounting/use-bank-fetcher";
import { route } from "~/util/route";
import { PartyAutocompleteField } from "../home.order.$partyOrder.new/components/party-autocomplete";
import { GlobalState } from "~/types/app-types";
import { LedgerAutocompleteFormField } from "~/util/hooks/fetchers/use-account-ledger-fetcher";
import { cn } from "@/lib/utils";

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
  isNew,
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<BankAccountType>;
  onSubmit: (e: BankAccountType) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
  isNew?: boolean;
}) {
  const { t } = useTranslation("common");
  const formValues = form.getValues();
  const { roleActions } = useOutletContext<GlobalState>();
  const [searchParams, setSearchParams] = useSearchParams();

  const openModal = (key: string, value: any, args?: Record<string, any>) => {
    searchParams.set(key, value);
    if (args) {
      Object.entries(args).forEach(([key, value]) => {
        searchParams.set(key, value);
      });
    }
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(isNew ? "create-grid" : "detail-grid")}
        >
          {/* {JSON.stringify(form.formState.errors)} */}
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
            form={form}
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
              form={form}
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
                    form={form}
                    partyType={formValues.partyType}
                    allowEdit={allowEdit}
                    roleActions={roleActions}
                    openModal={openModal}
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

          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
