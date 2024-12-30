import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { paymentDataSchema } from "~/util/data/schemas/accounting/payment-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PartyType, partyTypeToJSON, PaymentType } from "~/gen/common";

import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { routes } from "~/util/route";
import { action, loader } from "./route";
import { useCreatePayment } from "./use-create-payment";
import { formatAmount, formatAmountToInt } from "~/util/format/formatCurrency";
import { Card } from "@/components/ui/card";
import { parties } from "~/util/party";
import PaymentData from "./payment-data";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

export default function PaymentCreateClient() {
  const { associatedActions, paymentAccounts } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const { t, i18n } = useTranslation("common");
  const createPayment = useCreatePayment();
  const form = useForm<z.infer<typeof paymentDataSchema>>({
    resolver: zodResolver(paymentDataSchema),
    defaultValues: {
      amount: formatAmount(createPayment.payload?.amount),
      paymentType: createPayment.payload?.paymentType,
      party: createPayment.payload?.partyName,
      partyID: createPayment.payload?.partyID,
      partyType: createPayment.payload?.partyType,
      partyReference: createPayment.payload?.partyReference,
      paymentReferences: createPayment.payload?.paymentReferences || [],
      postingDate: new Date(),
      taxLines: [],
    },
  });
  const formValues = form.getValues();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  const r = routes;
  const p = parties;

  const onPartyTypeChange = (d: z.infer<typeof paymentDataSchema>) => {
    switch (d.partyType) {
      case partyTypeToJSON(PartyType.customer):
        form.setValue("accountPaidFromID", paymentAccounts?.receivable_acct_id);
        form.setValue("accountPaidFromName", paymentAccounts?.receivable_acct);
        form.setValue("accountPaidToID", paymentAccounts?.cash_acct_id);
        form.setValue("accountPaidToName", paymentAccounts?.cash_acct);
        break;
      case partyTypeToJSON(PartyType.supplier):
        form.setValue("accountPaidToID", paymentAccounts?.payable_acct_id);
        form.setValue("accountPaidToName", paymentAccounts?.payable_acct);
        form.setValue("accountPaidFromID", paymentAccounts?.cash_acct_id);
        form.setValue("accountPaidFromName", paymentAccounts?.cash_acct);
        break;
    }
    form.trigger("accountPaidFromID");
    form.trigger("accountPaidToID");
  };

  const onSubmit = (values: z.infer<typeof paymentDataSchema>) => {
    fetcher.submit(
      {
        action: "create-payment",
        createPayment: values as any,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  // const setUpToolbar = () => {
  //   toolbar.setToolbar({
  //     onSave: () => {
  //       inputRef.current?.click();
  //     },
  //   });
  // };

  setUpToolbar(() => {
    return {
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  useEffect(() => {
    onPartyTypeChange(formValues);
  }, [formValues.partyType, paymentAccounts]);

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

  return (
    <Card>
      <PaymentData
        form={form}
        onSubmit={onSubmit}
        fetcher={fetcher}
        inputRef={inputRef}
      />
    </Card>
  );
}
