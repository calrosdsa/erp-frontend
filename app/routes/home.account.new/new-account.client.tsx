import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { accountLedgerDataSchema } from "~/util/data/schemas/accounting/account.schema";
import { action } from "./route";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import SelectForm from "@/components/custom/select/SelectForm";
import {
  LedgerAutocompleteForm,
} from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import { route } from "~/util/route";
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
import AccountLedgerForm from "./account-form";

export default function NewAccountClient() {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const newAccount = useNewAccount();
  const form = useForm<z.infer<typeof accountLedgerDataSchema>>({
    resolver: zodResolver(accountLedgerDataSchema),
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
  

  const onSubmit = (values: z.infer<typeof accountLedgerDataSchema>) => {
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
   <>
   <AccountLedgerForm
   allowEdit={allowEdit}
   />
   </>
  );
}
