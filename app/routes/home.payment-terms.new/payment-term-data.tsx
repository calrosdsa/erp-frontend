import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import Autocomplete from "@/components/custom/select/Autocomplete";
import SelectForm from "@/components/custom/select/SelectForm";
import { Form } from "@/components/ui/form";
import { FetcherWithComponents } from "@remix-run/react";
import { MutableRefObject } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { dueDateBaseOnOptions } from "~/data";
import { PaymentTermsType } from "~/util/data/schemas/document/payment-terms.schema";

export default function PaymentTermsData({
  fetcher,
  form,
  onSubmit,
  inputRef,
  allowEdit = true,
}: {
  fetcher: FetcherWithComponents<any>;
  form: UseFormReturn<PaymentTermsType>;
  onSubmit: (e: PaymentTermsType) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  allowEdit?: boolean;
}) {
  const { t } = useTranslation("common");
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
            <CustomFormFieldInput
              control={form.control}
              name="invoice_portion"
              label={"Porción de factura"}
              inputType="input"
              description="La parte del monto total de la factura a la que se aplica este término de pago"
              allowEdit={allowEdit}
              required={true}
            />

            <SelectForm
              name="due_date_base_on"
              label={"Fecha de vencimiento basada en"}
              keyName="name"
              keyValue="value"
              description="La base para calcular la fecha de vencimiento del término de pago"
              control={form.control}
              data={dueDateBaseOnOptions}
              allowEdit={allowEdit}
              required={true}
            />

            <CustomFormFieldInput
              control={form.control}
              name="credit_days"
              label={"Días de crédito"}
              description="El número de días o meses de crédito depende de la opción en el campo Fecha de vencimiento basada en."
              inputType="input"
              allowEdit={allowEdit}
              required={true}
            />

            <CustomFormFieldInput
              control={form.control}
              name="description"
              label={"Descripción"}
              inputType="textarea"
              allowEdit={allowEdit}
            />
          </div>

          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
