import { useFetcher, useRevalidator } from "@remix-run/react";
import { action } from "./route";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
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

export default function PaymentCreateClient() {
  const fetcher = useFetcher<typeof action>();
  const fetcherPaymentPartiesType = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const [paymentTypes, setPaymentTypes] = useState<SelectItem[]>([]);
  const form = useForm<z.infer<typeof createPaymentSchema>>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {},
  });
  const [partiesDebounceFetcher,onPartyNameChange] = usePartyDebounceFetcher({
    partyType:form.getValues().partyType
  })
  const revalidator = useRevalidator()

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
  const onSubmit = (values: z.infer<typeof createPaymentSchema>) => {};

  useEffect(() => {
    setUpPaymentTypes();
    fetchInitialData();
  }, []);

  useEffect(() => {
    // if(fetcher.data.){
    // }
  }, [fetcher.data]);
  return (
    <FormLayout>
      <Form {...form}>
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
              onValueChange={()=>{
                revalidator.revalidate()
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
                    onSelect={(e)=>{
                        form.setValue("partyUuid",e.uuid)
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
            label={t("form.paidAmount",{o:"BOB"})}
            name="amount"
            children={(field) => {
                return <Input {...field} type="number" />;
              }}
            />

            <Typography className=" col-span-full" fontSize={subtitle}>
              {t("accounts")}
            </Typography>


          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
