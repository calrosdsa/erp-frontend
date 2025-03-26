import { Card } from "@/components/ui/card";
import BankAccountData from "./cash-outflow-form";
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
import { useCashOutflowStore } from "./cash-outflow.store";
import { cashOutflowDataSchema, CashOutflowDataType } from "~/util/data/schemas/accounting/cash-outflow.schema";
import CashOutflowForm from "./cash-outflow-form";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { format } from "date-fns";

export default function NewCashOutflowClient() {
  const fetcher = useFetcher<typeof action>();
  const { payload, setPayload } = useCashOutflowStore();
    const taxLinesStore = useTaxAndCharges();
  
  const form = useForm<CashOutflowDataType>({
    resolver: zodResolver(cashOutflowDataSchema),
    defaultValues: {
      ...payload,
      posting_date:new Date(),
      posting_time:format(new Date(), "HH:mm:ss"),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      taxLines:taxLinesStore.lines,
    },
  });
  const watchedFields = useWatch({
    control: form.control,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const onSubmit = (e: CashOutflowDataType) => {
    fetcher.submit(
      {
        action: "create",
        createData: e as any,
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
        o: t("cashOutflow"),
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
            navigate(
              route.toRoute({
                main: route.cashOutflow,
                routeSufix: [fetcher.data.entity?.code],
                q: {
                  tab: "info",
                },
              })
            );
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
      <CashOutflowForm
        fetcher={fetcher}
        form={form}
        inputRef={inputRef}
        onSubmit={onSubmit}
        isNew={true}
      />
    </Card>
  );
}
