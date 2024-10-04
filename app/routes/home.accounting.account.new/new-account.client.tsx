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
import { AccountRootType } from "~/gen/common";
import SelectForm from "@/components/custom/select/SelectForm";
import { Button } from "@/components/ui/button";
import { useAccountLedgerDebounceFetcher } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { routes } from "~/util/route";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";

export default function NewAccountClient() {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createAccountLedger>>({
    resolver: zodResolver(createAccountLedger),
    defaultValues: {
      currency:""
    },
  });
  const toolbar = useToolbar();
  const [accountRootTypes, setAccountRootTypes] = useState<SelectItem[]>([]);
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
        name: t(AccountRootType[AccountRootType.ASSET]),
        value: AccountRootType[AccountRootType.ASSET],
      },
      {
        name: t(AccountRootType[AccountRootType.LIABILITIES]),
        value: AccountRootType[AccountRootType.LIABILITIES],
      },
      {
        name: t(AccountRootType[AccountRootType.REVENUE]),
        value: AccountRootType[AccountRootType.REVENUE],
      },
      {
        name: t(AccountRootType[AccountRootType.EXPENSE]),
        value: AccountRootType[AccountRootType.EXPENSE],
      },
    ];
    setAccountRootTypes(n);
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
        r.toAccountLedgerDetail(
          fetcher.data.accountLedger?.name,
          fetcher.data.accountLedger?.uuid
        )
      );
    }
  }, [fetcher.data]);

  return (
    <FormLayout>
      <Form {...form}>
        {JSON.stringify(form.formState.errors)}
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
              onChange={(e)=>{
                if(e){
                }else{
                }
              }}
              description={t("form.isGroupDescription")}
              name="isGroup"
            />

            <SelectForm
              data={accountRootTypes}
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
            {!form.getValues().isGroup &&
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
            }

            {/* <div className=" col-span-full"></div> */}
            <CustomFormField
              label={t("form.description")}
              form={form}
              name="description"
              children={(field) => {
                return <Textarea {...field} />;
              }}
            />
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
