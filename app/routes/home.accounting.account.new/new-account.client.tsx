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
import { useAccountLedgerDebounceFetcher } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { routes } from "~/util/route";
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

export default function NewAccountClient() {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const newAccount = useNewAccount();
  const form = useForm<z.infer<typeof createAccountLedger>>({
    resolver: zodResolver(createAccountLedger),
    defaultValues: {
      currency: "",
      parentName: newAccount.payload?.parentName,
      parentUuid: newAccount.payload?.parentUUID,
    },
  });
  const toolbar = useToolbar();
  const [accountRootTypes, setAccountRootTypes] = useState<SelectItem[]>([]);
  const [accountTypes, setAccountTypes] = useState<SelectItem[]>([]);
  const globalState = useOutletContext<GlobalState>();
  const [currencyDebounceFetcher, onCurrencyNameChange] =
    useCurrencyDebounceFetcher();
  const [groupAccountDebounceFetcher, onNameChange] =
    useAccountLedgerDebounceFetcher({
      isGroup: true,
    });
  const [accountLedgerPermission] = usePermission({
    actions: groupAccountDebounceFetcher.data?.actions,
    roleActions: globalState.roleActions,
  });

  const r = routes;
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
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

  const setUpToolbar = () => {
    toolbar.setToolbar({
      title: t("f.add-new", { o: t("_ledger.base").toLocaleLowerCase() }),
      onSave: () => {
        inputRef.current?.click();
      },
    });
  };

  useEffect(() => {
    setUpToolbar();
    setUpAccountRootTypes();
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
            <CustomFormField
              label={t("form.name")}
              form={form}
              name="name"
              children={(field) => {
                return <Input {...field} />;
              }}
            />

            <FormAutocomplete
              form={form}
              label={t("f.parent", { o: t("_ledger.base") })}
              onValueChange={onNameChange}
              data={groupAccountDebounceFetcher.data?.accounts || []}
              nameK={"name"}
              name="parentName"
              onSelect={(e) => {
                form.setValue("parentUuid", e.uuid);
              }}
            />

            <CheckForm
              label={t("form.enabled")}
              form={form}
              description={t("f.enable", { o: t("_ledger.base") })}
              name="enabled"
            />

            <CheckForm
              label={t("form.isGroup")}
              form={form}
              onChange={(e) => {
                if (e) {
                } else {
                }
              }}
              description={t("form.isGroupDescription")}
              name="isGroup"
            />

            <SelectForm
              data={accountRootTypes}
              label={t("_ledger.rootType")}
              name="accountRootType"
              keyName={"name"}
              keyValue={"value"}
              form={form}
            />

            <SelectForm
              data={accountTypes}
              label={t("_ledger.type")}
              name="accountType"
              keyName={"name"}
              keyValue={"value"}
              form={form}
            />

            <CustomFormField
              label={t("_ledger.no")}
              form={form}
              name="ledgerNo"
              children={(field) => {
                return <Input {...field} />;
              }}
            />
            {!form.getValues().isGroup && (
              <FormAutocomplete
                data={currencyDebounceFetcher.data?.currencies || []}
                form={form}
                name="currencyName"
                nameK={"code"}
                onValueChange={onCurrencyNameChange}
                label={t("form.currency")}
                onSelect={(v) => {
                  form.setValue("currency", v.code);
                }}
              />
            )}

            {/* <div className=" col-span-full"></div> */}
            <CustomFormField
              label={t("form.description")}
              form={form}
              name="description"
              children={(field) => {
                return <Textarea {...field} />;
              }}
            />

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
                label={t("form.reportType")}
                name="reportType"
                keyName={"name"}
                keyValue={"value"}
                form={form}
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
                label={t("form.cashFlowSection")}
                name="cashFlowSection"
                keyName={"name"}
                keyValue={"value"}
                form={form}
              />
            </AccordationLayout>
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
