import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
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

export default function NewAccountClient() {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createAccountLedger>>({
    resolver: zodResolver(createAccountLedger),
    defaultValues: {},
  });
  const toolbar = useToolbar();
  const [accountRootTypes, setAccountRootTypes] = useState<SelectItem[]>([]);
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

            <CheckForm
              label={t("form.enabled")}
              form={form}
              description={t("f.enable", { o: t("_ledger.base") })}
              name="enabled"
            />

            <CheckForm
              label={t("form.isGroup")}
              form={form}
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
