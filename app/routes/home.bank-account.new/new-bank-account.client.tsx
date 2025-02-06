import { Card } from "@/components/ui/card";
import BankAccountData from "./bank-account-data";
import { useFetcher, useNavigate } from "@remix-run/react";
import { action } from "./route";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { route } from "~/util/route";
import {
  bankAccountSchema,
  BankAccountType,
} from "~/util/data/schemas/accounting/bank-account.schema";
import { useBankAccountStore } from "./bank-account.store";

export default function NewBankAccountClient() {
  const fetcher = useFetcher<typeof action>();
  const { payload, setPayload } = useBankAccountStore();
  const form = useForm<BankAccountType>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: payload ? payload : {},
  });
  const watchedFields = useWatch({
    control: form.control,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const onSubmit = (e: BankAccountType) => {
    fetcher.submit(
      {
        action: "create",
        createData: e,
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

  setUpToolbar(() => {
    return {
      titleToolbar: t("f.add-new", {
        o: t("bankAccount"),
      }),
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, [t]);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.entity) {
          if (form.getValues()._go_back) {
            navigate(-1);
          } else {
            navigate(
              route.toRoute({
                main: route.bankAccount,
                routeSufix: [fetcher.data.entity?.account_name],
                q: {
                  tab: "info",
                  id: fetcher.data.entity?.uuid,
                },
              })
            );
          }
        }
      },
    },
    [fetcher.data]
  );

  useEffect(() => {
    setPayload(form.getValues());
  }, [watchedFields]);

  return (
    <Card>
      <BankAccountData
        fetcher={fetcher}
        form={form}
        inputRef={inputRef}
        onSubmit={onSubmit}
      />
    </Card>
  );
}
