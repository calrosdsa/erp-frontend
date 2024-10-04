import { useFetcher, useRevalidator } from "@remix-run/react";
import { action } from "./route";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createPaymentSchema } from "~/util/data/schemas/accounting/payment-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import SelectForm from "@/components/custom/select/SelectForm";
import { PaymentType } from "~/gen/common";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import Typography, { subtitle } from "@/components/typography/Typography";
import { Separator } from "@/components/ui/separator";
import { usePartyDebounceFetcher } from "~/util/hooks/fetchers/usePartyDebounceFetcher";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { Input } from "@/components/ui/input";
import { useAccountLedgerDebounceFetcher } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import { useToolbar } from "~/util/hooks/ui/useToolbar";

export default function PaymentCreateClient() {
  const fetcherPaymentPartiesType = useFetcher<typeof action>();
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const [paymentTypes, setPaymentTypes] = useState<SelectItem[]>([]);
  const form = useForm<z.infer<typeof createPaymentSchema>>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      modeOfPayment:"PAYMENT"
    },
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toolbar = useToolbar()

  const [accountPaidFromFetcher, onAccountPaidFromChange] =
    useAccountLedgerDebounceFetcher({
      isGroup: false,
    });
  const [accountPaidToFetcher, onAccountPaidToChange] =
    useAccountLedgerDebounceFetcher({
      isGroup: false,
    });
  const [partiesDebounceFetcher, onPartyNameChange] = usePartyDebounceFetcher({
    partyType: form.getValues().partyType,
  });
  const revalidator = useRevalidator();

  const fetchInitialData = () => {
    fetcherPaymentPartiesType.submit(
      {
        action: "payment-parties",
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };
  
  const onSubmit = (values: z.infer<typeof createPaymentSchema>) => {
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
  const setUpPaymentTypes = () => {
    const n: SelectItem[] = [
      {
        name: t(PaymentType[PaymentType.PAY]),
        value: PaymentType[PaymentType.PAY],
      },
      {
        name: t(PaymentType[PaymentType.RECEIVE]),
        value: PaymentType[PaymentType.RECEIVE],
      },
      {
        name: t(PaymentType[PaymentType.INTERNAL_TRANSFER]),
        value: PaymentType[PaymentType.INTERNAL_TRANSFER],
      },
    ];
    setPaymentTypes(n);
  };

  const setUpToolbar = ()=>{
    toolbar.setToolbar({
      onSave: () => {
        inputRef.current?.click();
      },
    });
  }

  useEffect(() => {
    setUpPaymentTypes();
    fetchInitialData();
    setUpToolbar();
  }, []);

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });

      if (fetcher.data?.message) {
        toast({
          title: fetcher.data.message,
        });
      }
    }
  }, [fetcher.data]);
  return (
    <FormLayout>
      <Form {...form}>
        {JSON.stringify(form.formState.errors)}
        <fetcher.Form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("", "gap-y-3 grid p-3")}
        >
          <div className="create-grid">
            <Typography className=" col-span-full" fontSize={subtitle}>
              {t("_payment.type")}
            </Typography>
            <CustomFormDate
              form={form}
              name="postingDate"
              label={t("form.date")}
            />
            <SelectForm
              form={form}
              data={paymentTypes}
              label={t("form.paymentType")}
              keyName={"name"}
              keyValue={"value"}
              name="paymentType"
            />
            <Separator className=" col-span-full" />

            <Typography className=" col-span-full" fontSize={subtitle}>
              {t("_payment.paymentFromTo")}
            </Typography>

            <SelectForm
              form={form}
              data={fetcherPaymentPartiesType.data?.partiesType || []}
              label={t("form.partyType")}
              keyName={"name"}
              onValueChange={() => {
                revalidator.revalidate();
              }}
              keyValue={"code"}
              name="partyType"
            />

            {form.getValues().partyType && (
              <div>
                <FormAutocomplete
                  data={partiesDebounceFetcher.data?.parties || []}
                  form={form}
                  label={t("form.party")}
                  onValueChange={onPartyNameChange}
                  name="partyName"
                  onSelect={(e) => {
                    form.setValue("partyUuid", e.uuid);
                  }}
                  nameK={"name"}
                />
              </div>
            )}
            <Typography className=" col-span-full" fontSize={subtitle}>
              {t("form.amount")}
            </Typography>

            <CustomFormField
              form={form}
              label={t("form.paidAmount", { o: "BOB" })}
              name="amount"
              children={(field) => {
                return <Input {...field} type="number" />;
              }}
            />

            <Typography className=" col-span-full" fontSize={subtitle}>
              {t("accounts")}
            </Typography>

            <FormAutocomplete
              data={accountPaidFromFetcher.data?.accounts || []}
              form={form}
              label={t("_ledger.paidFrom")}
              onValueChange={onAccountPaidFromChange}
              name="accountPaidFromName"
              onSelect={(e) => {
                form.setValue("accountPaidFrom", e.uuid);
              }}
              nameK={"name"}
            />

            <FormAutocomplete
              data={accountPaidToFetcher.data?.accounts || []}
              form={form}
              label={t("_ledger.paidTo")}
              onValueChange={onAccountPaidToChange}
              name="accountPaidToName"
              onSelect={(e) => {
                form.setValue("accountPaidTo", e.uuid);
              }}
              nameK={"name"}
            />
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
