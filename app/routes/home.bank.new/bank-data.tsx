import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
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
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<BankDataType>;
  onSubmit: (e: BankDataType) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
}) {
  const {t} = useTranslation("common")
  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"gap-y-3 grid p-3"}
        >
          <div className="create-grid">
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
              
          </div>

          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
