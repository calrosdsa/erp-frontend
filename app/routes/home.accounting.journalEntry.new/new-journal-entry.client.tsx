import FormLayout from "@/components/custom/form/FormLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { createJournalEntrySchema } from "~/util/data/schemas/accounting/journal-entry-schema";
import { routes } from "~/util/route";
import { action } from "./route";
import { Form } from "@/components/ui/form";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import SelectForm from "@/components/custom/select/SelectForm";
import { PaymentType } from "~/gen/common";
import { Separator } from "@/components/ui/separator";

export default function NewJournalEntryClient(){
    const {t} = useTranslation("common")
    const route = routes
    const fetcher = useFetcher<typeof action>()
    const entryTypes: SelectItem[] = [
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
    const form = useForm<z.infer<typeof createJournalEntrySchema>>({
        resolver:zodResolver(createJournalEntrySchema),
        defaultValues:{
        }
    })
    useDisplayMessage({
        error:fetcher.data?.error,
        success:fetcher.data?.message,
    },[fetcher.data])
    return (
        <FormLayout>
            <Form {...form}>
                <fetcher.Form>
                <div className="create-grid">

            {/* <Typography className=" col-span-full" variant="title2">
              {t("_payment.type")}
            </Typography> */}
            <CustomFormDate
              form={form}
              name="postingDate"
              label={t("form.date")}
              />
            <SelectForm
              form={form}
              data={entryTypes}
              label={t("form.entryTypes")}
              keyName={"name"}
              keyValue={"value"}
              name="paymentType"
              />
            <Separator className=" col-span-full" />
              </div>
                </fetcher.Form>
            </Form>
        </FormLayout>
    )
}