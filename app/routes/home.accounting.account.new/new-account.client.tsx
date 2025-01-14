import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { createAccountLedger } from "~/util/data/schemas/accounting/account-schema";
import { action } from "./route";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import FormLayout from "@/components/custom/form/FormLayout";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import CheckForm from "@/components/custom/input/CheckForm";
import SelectForm from "@/components/custom/select/SelectForm";
import { Button } from "@/components/ui/button";
import {
  LedgerAutocompleteForm,
  useAccountLedgerDebounceFetcher,
} from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { route } from "~/util/route";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { useNewAccount } from "./use-new-account";
import {
  AccountType,
  CashFlowSection,
  cashFlowSectionToJSON,
  FinacialReport,
  finacialReportToJSON,
} from "~/gen/common";
import AccordationLayout from "@/components/layout/accordation-layout";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";

export default function NewAccountClient() {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const newAccount = useNewAccount();
  const form = useForm<z.infer<typeof createAccountLedger>>({
    resolver: zodResolver(createAccountLedger),
    defaultValues: {
      parent: newAccount.payload?.parentName,
      parentID: newAccount.payload?.parentID,
    },
  });
  const formValues = form.getValues();
  const r = route;
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  // const [accountRootTypes, setAccountRootTypes] = useState<SelectItem[]>([]);
  const [accountTypes, setAccountTypes] = useState<SelectItem[]>([]);
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

  const onSubmit = (values: z.infer<typeof createAccountLedger>) => {
    fetcher.submit(
      {
        action: "create-ledger-account",
        createAccountLedger: values,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  setUpToolbar(() => {
    return {
      titleToolbar: t("f.add-new", {
        o: t("_ledger.base").toLocaleLowerCase(),
      }),
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  useEffect(() => {
    setUpAccountTypes();
  }, []);

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
    }
    if (fetcher.data?.message) {
      toast({
        title: fetcher.data.message,
      });
      navigate(
        r.toRoute({
          main: r.accountM,
          routePrefix: [r.accountingM],
          routeSufix: [fetcher.data.accountLedger?.name || ""],
          q: {
            tab: "info",
          },
        })
      );
    }
  }, [fetcher.data]);

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="create-grid">
            <CustomFormFieldInput
              label={t("form.name")}
              control={form.control}
              name="name"
              inputType="input"
            />

            <LedgerAutocompleteForm
              label="Cuenta Principal"
              control={form.control}
              name="parent"
              isGroup={true}
              onSelect={(e) => {
                form.setValue("parentID", e.id);
              }}
            />
            <CustomFormFieldInput
              label={t("form.isGroup")}
              control={form.control}
              name="isGroup"
              inputType="check"
              // description={t("form.isGroupDescription")}
              onChange={() => {
                form.trigger("isGroup");
              }}
            />
            <div className=" col-span-full" />

            <SelectForm
              data={accountRootTypes}
              label={t("_ledger.rootType")}
              name="accountRootType"
              keyName={"name"}
              keyValue={"value"}
              control={form.control}
            />

            {!formValues.isGroup && (
              <SelectForm
                data={accountTypes}
                label={t("_ledger.type")}
                name="accountType"
                keyName={"name"}
                keyValue={"value"}
                control={form.control}
              />
            )}

            <CustomFormFieldInput
              label={t("_ledger.no")}
              control={form.control}
              name="ledgerNo"
              inputType="input"
            />
            {/* <div className=" col-span-full"></div> */}

            <AccordationLayout
              title="Report"
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
                keyName={"name"}
                keyValue={"value"}
                control={form.control}
              />
            </AccordationLayout>
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
