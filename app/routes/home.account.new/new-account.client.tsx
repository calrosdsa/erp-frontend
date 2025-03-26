import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFetcher,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { accountLedgerDataSchema } from "~/util/data/schemas/accounting/account-ledger.schema";
import { action } from "./route";
import { route } from "~/util/route";
import { useNewAccount } from "./use-new-account";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import AccountLedgerForm from "./account-ledger-form";
import { useAccounLedgerStore } from "./account-ledger-store";
import { Card } from "@/components/ui/card";

export default function NewAccountClient() {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const { payload, setPayload } = useAccounLedgerStore();
  const form = useForm<z.infer<typeof accountLedgerDataSchema>>({
    resolver: zodResolver(accountLedgerDataSchema),
    defaultValues: payload,
  });
  const watchedFields = useWatch({
    control: form.control,
  });
  const r = route;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const allowEdit = true;

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
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
    }
    if (fetcher.data?.message) {
      toast({
        title: fetcher.data.message,
      });
      const redirect = searchParams.get("redirect");
      if (redirect) {
        navigate(redirect);
      } else {
        navigate(
          r.toRoute({
            main: r.accountM,
            routeSufix: [fetcher.data.accountLedger?.name || ""],
            q: {
              tab: "info",
              id: fetcher.data.accountLedger?.id.toString() || "",
            },
          })
        );
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    setPayload(form.getValues());
  }, [watchedFields]);

  return (
    <>
      <Card>
        <AccountLedgerForm
          allowEdit={allowEdit}
          form={form}
          fetcher={fetcher}
          onSubmit={onSubmit}
          inputRef={inputRef}
          isNew={true}
        />
      </Card>
    </>
  );
}
