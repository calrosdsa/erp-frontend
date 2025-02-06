import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { paymentDataSchema } from "~/util/data/schemas/accounting/payment-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PartyType, partyTypeToJSON, PaymentType } from "~/gen/common";

import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { route } from "~/util/route";
import { action, loader } from "./route";
import { useCreatePayment, usePaymentStore } from "./payment-store";
import { formatAmount, formatAmountToInt } from "~/util/format/formatCurrency";
import { Card } from "@/components/ui/card";
import { party } from "~/util/party";
import PaymentData from "./payment-data";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { FormService, PartyTypeStrategyFactory, usePaymentData } from "./use-payment-data";
export default function PaymentCreateClient() {
  const { paymentAccounts } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const {i18n} = useTranslation("common")
  const toolbar = useToolbar()  
  const { payload, setPayload } = usePaymentStore();
  const form = useForm<z.infer<typeof paymentDataSchema>>({
    resolver: zodResolver(paymentDataSchema),
    defaultValues: payload ? {
      ...payload,
      taxLines:payload.taxLines ?  payload.taxLines : [],
      postingDate:new Date(),
    } : {},  
  });
  const formValues = form.getValues();
  const inputRef = useRef<HTMLInputElement | null>(null);
 const watchedFields = useWatch({
    control: form.control,
  });
  const navigate = useNavigate();
  const r = route;
  const p = party;
 const {accountBalanceService} = usePaymentData({
    form:form,
    i18n:i18n
  })

  const formService: FormService = {
    setValue: (field: any, value: any) => form.setValue(field, value),
    trigger: (field: any) => form.trigger(field),
  }

  const onPartyTypeChange = async (data: z.infer<typeof paymentDataSchema>) => {
    console.log("PAYMENT ACCOUNTS",paymentAccounts)
    if(paymentAccounts == undefined) return
    const strategy = PartyTypeStrategyFactory.createStrategy(
      data.partyType,
      paymentAccounts,
      accountBalanceService,
      formService
    )
    await strategy.updateAccounts()
  }


  // const onPartyTypeChange = async(d: z.infer<typeof paymentDataSchema>) => {
  //   switch (d.partyType) {
  //     case partyTypeToJSON(PartyType.customer):
  //       form.setValue("accountPaidTo", {
  //         id:paymentAccounts?.cash_acct_id,
  //         name:paymentAccounts?.cash_acct,
  //       });
  //       await getAccountBalance(paymentAccounts?.cash_acct,paymentAccounts?.cash_acct_id,(balance)=>{
  //         form.setValue("accountPaidToBalance",balance?.opening_balance)
  //       })
  //       form.setValue("accountPaidFrom", {
  //         id:paymentAccounts?.receivable_acct_id,
  //         name:paymentAccounts?.receivable_acct,
  //       });
  //       await getAccountBalance(paymentAccounts?.receivable_acct,paymentAccounts?.receivable_acct_id,(balance)=>{
  //         form.setValue("accountPaidFromBalance",balance?.opening_balance)
  //       })
  //       break;
  //     case partyTypeToJSON(PartyType.supplier):
  //       form.setValue("accountPaidTo", {
  //         id:paymentAccounts?.payable_acct_id,
  //         name:paymentAccounts?.payable_acct,
  //       });
  //       await getAccountBalance(paymentAccounts?.payable_acct,paymentAccounts?.payable_acct_id,(balance)=>{
  //         form.setValue("accountPaidToBalance",balance?.opening_balance)
  //       })
  //       form.setValue("accountPaidFrom", {
  //         id:paymentAccounts?.cash_acct_id,
  //         name:paymentAccounts?.cash_acct,
  //       });
  //       await getAccountBalance(paymentAccounts?.cash_acct,paymentAccounts?.cash_acct_id,(balance)=>{
  //         form.setValue("accountPaidFromBalance",balance?.opening_balance)
  //       })
  //       form.trigger("accountPaidFromBalance")
  //       form.trigger("accountPaidToBalance")

        
  //       break;
  //   }
    
  // };

  const onSubmit = (values: z.infer<typeof paymentDataSchema>) => {
    console.log("SUBMIT PAYMENT")
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

  // const setUpToolbar = () => {
  //   toolbar.setToolbar({
  //     onSave: () => {
  //       inputRef.current?.click();
  //     },
  //   });
  // };

  useEffect(() => {
    toolbar.setToolbar({
      onSave: () => {
        inputRef.current?.click();
      },
    })
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
    <Card>
      {JSON.stringify(form.formState.errors)}
      <PaymentData
        form={form}
        onSubmit={onSubmit}
        fetcher={fetcher}
        allowEdit={true}
        inputRef={inputRef}
      />
    </Card>
  );
}
