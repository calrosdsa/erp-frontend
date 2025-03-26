import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FetcherWithComponents } from "@remix-run/react";
import { MutableRefObject } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BankDataType } from "~/util/data/schemas/accounting/bank.schema";

export default function BankData({
  fetcher,
  form,
  onSubmit,
  inputRef,
  allowEdit = true,
  isNew,
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<BankDataType>;
  onSubmit: (e: BankDataType) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
  isNew?: boolean;
}) {
  const { t } = useTranslation("common");
  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(isNew ? "create-grid" : "detail-grid")}
        >
          {/* {JSON.stringify(form.formState.errors)} */}
          <CustomFormFieldInput
            control={form.control}
            name="name"
            label={t("form.name")}
            inputType="input"
            allowEdit={allowEdit}
            required={true}
          />

          {/* <CustomFormFieldInput
                className=" col-span-full"
                control={form.control}
                name="terms_and_conditions"
                required={true}
                label={t("termsAndConditions")}
                inputType="richtext"
                allowEdit={allowEdit}
              /> */}

          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
