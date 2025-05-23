import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import PaymentTermLines from "@/components/custom/shared/document/payment-term-lines";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FetcherWithComponents } from "@remix-run/react";
import { MutableRefObject } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PaymentTermsTemplateType } from "~/util/data/schemas/document/payment-terms-template.schema";

export default function PaymentTermsTemplateData({
  fetcher,
  form,
  onSubmit,
  inputRef,
  allowEdit = true,
  // isNew,
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<PaymentTermsTemplateType>;
  onSubmit: (e: PaymentTermsTemplateType) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
  // isNew?: boolean;
}) {
  const { t } = useTranslation("common");
  const formValues = form.getValues();
  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          // className={cn(isNew ? "create-grid" : "detail-grid")}
          className={cn("create-grid")}
        >
          <CustomFormFieldInput
            control={form.control}
            name="name"
            label={t("form.name")}
            inputType="input"
            allowEdit={allowEdit}
            required={true}
          />
          <div className=" col-span-full">
            <PaymentTermLines
              control={form.control}
              formValues={formValues}
              allowEdit={allowEdit}
            />
          </div>

          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
