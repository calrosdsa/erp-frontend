import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { paymentDataSchema } from "~/util/data/schemas/accounting/payment-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
import { route } from "~/util/route";
import { action, loader } from "./route";
import { usePaymentStore } from "./payment-store";
import { Card } from "@/components/ui/card";
import { party } from "~/util/party";
import PaymentData from "./payment-data";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import {
  FormService,
  PartyTypeStrategyFactory,
  usePaymentData,
} from "./use-payment-data";
import CreateLayout from "@/components/layout/create-layout";
export default function PaymentCreateClient() {
  const { paymentAccounts } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const { t, i18n } = useTranslation("common");
  const toolbar = useToolbar();
  const { payload, setPayload } = usePaymentStore();
  const form = useForm<z.infer<typeof paymentDataSchema>>({
    resolver: zodResolver(paymentDataSchema),
    defaultValues: {
      ...payload,
      taxLines: payload.taxLines ? payload.taxLines : [],
      paymentReferences: payload.paymentReferences
        ? payload.paymentReferences
        : [],
      postingDate: new Date(),
    },
  });
  const formValues = form.getValues();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const watchedFields = useWatch({
    control: form.control,
  });
  const navigate = useNavigate();
  const r = route;
  const p = party;
  const { accountBalanceService } = usePaymentData({
    form: form,
    i18n: i18n,
  });

  const formService: FormService = {
    setValue: (field: any, value: any) => form.setValue(field, value),
    trigger: (field: any) => form.trigger(field),
  };

  const onPartyTypeChange = async (data: z.infer<typeof paymentDataSchema>) => {
    console.log("PAYMENT ACCOUNTS", paymentAccounts);
    if (paymentAccounts == undefined) return;
    const strategy = PartyTypeStrategyFactory.createStrategy(
      data.partyType,
      paymentAccounts,
      accountBalanceService,
      formService
    );
    await strategy.updateAccounts();
  };

  const onSubmit = (values: z.infer<typeof paymentDataSchema>) => {
    console.log("SUBMIT PAYMENT");
    fetcher.submit(
      {
        action: "create-payment",
        paymentData: values as any,
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

  useEffect(() => {
    toolbar.setToolbar({
      titleToolbar: t("f.add-new", { o: t("payment") }),
      onSave: () => {
        inputRef.current?.click();
      },
    });
  }, []);

  useEffect(() => {
    onPartyTypeChange(formValues);
  }, [formValues.partyType]);

  useDisplayMessage(
    {
      success: fetcher.data?.message,
      error: fetcher.data?.error,
      onSuccessMessage: () => {
        navigate(
          r.toRoute({
            main: p.payment,
            routeSufix: [fetcher.data?.payment?.code || ""],
            q: {
              tab: "info",
            },
          })
        );
      },
    },
    [fetcher.data]
  );

  useEffect(() => {
    setPayload(form.getValues());
  }, [watchedFields]);

  return (
    <CreateLayout>
      <PaymentData
        form={form}
        onSubmit={onSubmit}
        fetcher={fetcher}
        allowEdit={true}
        inputRef={inputRef}
      />
    </CreateLayout>
  );
}
