import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app";
import { editChargesTemplateSchema } from "~/util/data/schemas/accounting/charges-template-schema";
import { useEffect, useRef, useState } from "react";
import { route } from "~/util/route";
import { useEditFields } from "~/util/hooks/useEditFields";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { z } from "zod";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { usePermission } from "~/util/hooks/useActions";
import { CurrencyAutocompleteForm } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { action, loader } from "../route";
import { editAccountLedger } from "~/util/data/schemas/accounting/account-schema";
import { LedgerAutocompleteForm } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import SelectForm from "@/components/custom/select/SelectForm";
import {
  AccountType,
  CashFlowSection,
  cashFlowSectionToJSON,
  FinacialReport,
  finacialReportToJSON,
} from "~/gen/common";
import AccordationLayout from "@/components/layout/accordation-layout";
type EditData = z.infer<typeof editAccountLedger>;
export default function AccountInfo() {
  const { t } = useTranslation("common");
  const { account, actions } = useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ actions, roleActions });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const [accountRootTypes, setAccountRootTypes] = useState<SelectItem[]>([]);
  const [accountTypes, setAccountTypes] = useState<SelectItem[]>([]);
  const setUpAccountRootTypes = () => {
    const n: SelectItem[] = [
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
    setAccountRootTypes(n);
  };

  const setUpAccountTypes = () => {
    const n: SelectItem[] = Object.keys(AccountType)
      .filter(
        (key) => !isNaN(Number(key)) && Number(key) != AccountType.UNRECOGNIZED
      ) // Filter to get only numeric values (enum values)
      .map((key) => {
        return {
          // name: t(AccountType[Number(key)] || ""), // Translate enum name
          name: AccountType[Number(key)], // Translate enum name
          value: AccountType[Number(key)] || "", // Use the numeric value of the enum
        } as unknown as SelectItem;
      });

    setAccountTypes(n); // Function to handle the updated list
  };

  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: editAccountLedger,
    defaultValues: {
      id: account?.id,
      name: account?.name,
      isGroup: account?.is_group,
      accountType: account?.account_type,
      accountRootType:account?.account_root_type,
      reportType: account?.report_type,
      cashFlowSection: account?.cash_flow_section,
      ledgerNo: account?.ledger_no,
      parent:account?.parent,
      parentID:account?.parent_id,
      // accountRootType:account.
    },
  });
  const allowEdit = permission?.edit || false;
  const formValues = form.getValues();

  const onSubmit = (e: EditData) => {
    fetcher.submit(
      {
        action: "edit",
        editData: e,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };
  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  setUpToolbar(
    (opts) => {
      return {
        ...opts,
        onSave: () => inputRef.current?.click(),
        disabledSave: !hasChanged,
      };
    },
    [hasChanged]
  );

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

  useEffect(() => {
    setUpAccountRootTypes();
    setUpAccountTypes();
  }, [t]);

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="info-grid">
            <CustomFormFieldInput
              label={t("form.name")}
              control={form.control}
              name="name"
              inputType="input"
              allowEdit={allowEdit}
            />

            <LedgerAutocompleteForm
              label="Cuenta Principal"
              control={form.control}
              name="parent"
              isGroup={true}
              allowEdit={allowEdit}
              onSelect={(e) => {
                form.setValue("parentID", e.id);
              }}
            />
            <CustomFormFieldInput
              label={t("form.isGroup")}
              control={form.control}
              name="isGroup"
              allowEdit={false}
              inputType="check"
              // description={t("form.isGroupDescription")}
            />
            <div className=" col-span-full" />

            <SelectForm
              data={accountRootTypes}
              label={t("_ledger.rootType")}
              name="accountRootType"
              keyName={"name"}
              keyValue={"value"}
              allowEdit={allowEdit}
              form={form}
            />

            {!formValues.isGroup && (
              <SelectForm
                data={accountTypes}
                label={t("_ledger.type")}
                name="accountType"
                keyName={"name"}
              allowEdit={allowEdit}
                keyValue={"value"}
                form={form}
              />
            )}

            <CustomFormFieldInput
              label={t("_ledger.no")}
              control={form.control}
              name="ledgerNo"
              inputType="input"
              allowEdit={allowEdit}
            />
            {/* <div className=" col-span-full"></div> */}

            <AccordationLayout
              title="Reporte"
              containerClassName=" col-span-full"
              className="create-grid"
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
                name="reportType"
                keyName={"name"}
                allowEdit={allowEdit}
                keyValue={"value"}
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
                name="cashFlowSection"
                allowEdit={allowEdit}
                keyName={"name"}
                keyValue={"value"}
                control={form.control}
              />
            </AccordationLayout>
          </div>
          <input className="hidden" type="submit" ref={inputRef} />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
