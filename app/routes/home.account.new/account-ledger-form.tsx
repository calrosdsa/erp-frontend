import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import SelectForm from "@/components/custom/select/SelectForm";
import { Typography } from "@/components/typography";
import { Form } from "@/components/ui/form";
import {
  FetcherWithComponents,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { MutableRefObject, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app-types";
import { AccountLedgerData } from "~/util/data/schemas/accounting/account-ledger.schema";
import { LedgerAutocompleteFormField } from "~/util/hooks/fetchers/use-account-ledger-fetcher";
import {
  AccountType,
  CashFlowSection,
  cashFlowSectionToJSON,
  FinacialReport,
  finacialReportToJSON,
} from "~/gen/common";
import AccordationLayout from "@/components/layout/accordation-layout";
import { cn } from "@/lib/utils";
import { route } from "~/util/route";

export default function AccountLedgerForm({
  fetcher,
  form,
  onSubmit,
  inputRef,
  allowEdit = true,
  isNew,
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<AccountLedgerData>;
  onSubmit: (e: AccountLedgerData) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
  isNew?: boolean;
}) {
  const { t } = useTranslation("common");
  const formValues = form.getValues();
  const [accountTypes, setAccountTypes] = useState<SelectItem[]>([]);
  const navigate = useNavigate();

  const setUpAccountTypes = () => {
    const n: SelectItem[] = Object.keys(AccountType)
      .filter(
        (key) => !isNaN(Number(key)) && Number(key) != AccountType.UNRECOGNIZED
      ) // Filter to get only numeric values (enum values)
      .map((key) => {
        return {
          name: t(AccountType[Number(key)] || ""), // Translate enum name
          value: AccountType[Number(key)] || "", // Use the numeric value of the enum
        } as unknown as SelectItem;
      });

    setAccountTypes(n); // Function to handle the updated list
  };
  const accountRootTypes: SelectItem[] = [
    {
      name: t(AccountType[AccountType.ASSET]),
      value: AccountType[AccountType.ASSET],
    },
    {
      name: t(AccountType[AccountType.LIABILITY]),
      value: AccountType[AccountType.LIABILITY],
    },
    {
      name: t(AccountType[AccountType.REVENUE]),
      value: AccountType[AccountType.REVENUE],
    },
    {
      name: t(AccountType[AccountType.EXPENSE]),
      value: AccountType[AccountType.EXPENSE],
    },
  ];

  useEffect(() => {
    setUpAccountTypes();
  }, []);

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(isNew ? "create-grid" : "detail-grid")}
        >
          {/* {JSON.stringify(form.formState.errors)} */}
          <Typography variant="subtitle2" className=" col-span-full">
            Detalles de la Cuenta
          </Typography>
          <CustomFormFieldInput
            control={form.control}
            name="name"
            label={t("form.name")}
            inputType="input"
            allowEdit={allowEdit}
          />
          <LedgerAutocompleteFormField
            label="Cuenta Principal"
            form={form}
            name="parent"
            isGroup={true}
            allowEdit={allowEdit}
            {...(formValues.parent?.id && {
              navigate: () => {
                navigate(
                  route.toRouteDetail(
                    route.accountLedger,
                    formValues.parent?.name,
                    {
                      tab: "info",
                      id: formValues.parent?.id,
                    }
                  )
                );
              },
            })}
          />

          <CustomFormFieldInput
            control={form.control}
            name="is_group"
            label={t("form.isGroup")}
            inputType="check"
            allowEdit={allowEdit}
          />

          <div className=" col-span-full" />

          <SelectForm
            data={accountRootTypes}
            label={t("_ledger.rootType")}
            name="account_root_type"
            keyName={"name"}
            keyValue={"value"}
            control={form.control}
            allowEdit={allowEdit}
          />

          {!formValues.is_group && (
            <SelectForm
              data={accountTypes}
              label={t("_ledger.type")}
              name="account_type"
              keyName={"name"}
              keyValue={"value"}
              allowEdit={allowEdit}
              control={form.control}
            />
          )}

          <CustomFormFieldInput
            label={t("_ledger.no")}
            control={form.control}
            name="ledger_no"
            inputType="input"
            allowEdit={allowEdit}
          />

          <AccordationLayout
            title="Report"
            containerClassName=" col-span-full"
            className=" grid grid-cols-2 gap-3"
          >
            <SelectForm
              data={[
                {
                  name: t("profitAndLoss"),
                  value: finacialReportToJSON(FinacialReport.PROFIT_AND_LOSS),
                },
                {
                  name: t("balanceSheet"),
                  value: finacialReportToJSON(FinacialReport.BALANCE_SHEET),
                },
              ]}
              label={"Tipo de Reporte"}
              name="report_type"
              keyName={"name"}
              keyValue={"value"}
              allowEdit={allowEdit}
              control={form.control}
            />

            <SelectForm
              data={[
                {
                  name: t(cashFlowSectionToJSON(CashFlowSection.OPERATING)),
                  value: cashFlowSectionToJSON(CashFlowSection.OPERATING),
                },
                {
                  name: cashFlowSectionToJSON(CashFlowSection.INVESTING),
                  value: cashFlowSectionToJSON(CashFlowSection.INVESTING),
                },
                {
                  name: cashFlowSectionToJSON(CashFlowSection.FINANCING),
                  value: cashFlowSectionToJSON(CashFlowSection.FINANCING),
                },
              ]}
              label={t("Sección de flujo de efectivo")}
              name="cash_flow_section"
              keyName={"name"}
              keyValue={"value"}
              allowEdit={allowEdit}
              control={form.control}
            />
          </AccordationLayout>

          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
