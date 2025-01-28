import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { useFetcher, useOutletContext } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { action } from "~/routes/api.document/route";
import { GlobalState } from "~/types/app";
import {
  AddressAndContactDataType,
  addressAndContactSchema,
} from "~/util/data/schemas/document/address-and-contact.schema";
import { docTermsSchema, DocTermsType } from "~/util/data/schemas/document/doc-terms.schema";
import { AddressAutoCompleteForm } from "~/util/hooks/fetchers/core/use-address-fetcher";
import { PaymentTermTemplateForm } from "~/util/hooks/fetchers/docs/use-payment-term-template-fetcher";
import { TermsAndConditionsForm } from "~/util/hooks/fetchers/docs/use-terms-and-conditions-fetcher";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useEditFields } from "~/util/hooks/useEditFields";
import { route } from "~/util/route";

export default function DocTerms({
  defaultValues,
  allowEdit,
}: {
  defaultValues: DocTermsType;
  allowEdit: boolean;
}) {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef, previousValues } =
    useEditFields<DocTermsType>({
      schema: docTermsSchema,
      defaultValues: defaultValues,
    });
  const { setRegister } = useSetupToolbarStore();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const r = route
  const onSubmit = (e: DocTermsType) => {
    fetcher.submit({
        docTermsData: e,
      action: "edit-doc-terms",
    },{
        method:"POST",
        action:r.apiDocument,
        encType:"application/json",
    });
  };

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        updateRef(form.getValues());
      },
    },
    [fetcher.data]
  );

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  useEffect(() => {
    setRegister("tab", {
      onSave: () => {
        console.log("ON SAVE ADDRESS AND CONTACT")
        inputRef.current?.click();
      },
      disabledSave: !allowEdit,
    });
  }, [allowEdit]);

  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"gap-y-3 grid p-3"}
        >
          <div className="create-grid">
              <PaymentTermTemplateForm
                allowEdit={allowEdit}
                control={form.control}
                name="payment_term_template"
                label="Plantilla de Condiciones de Pago"
                onClear={()=>{
                  form.setValue("payment_term_template_id",null)
                  form.setValue("payment_term_template",null)
                }}
                onSelect={(e) => {
                  form.setValue("payment_term_template_id", e.id);
                }}
              />
              <TermsAndConditionsForm
                allowEdit={allowEdit}
                control={form.control}
                name="terms_and_conditions"
                label="Términos y condiciones"
                onClear={()=>{
                  form.setValue("terms_and_conditions_id",null)
                  form.setValue("terms_and_conditions",null)
                }}
                onSelect={(e) => {
                  form.setValue("terms_and_conditions_id", e.id);
                }}
              />
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
