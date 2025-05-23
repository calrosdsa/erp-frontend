import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { action } from "~/routes/api.document/route";
import { GlobalState } from "~/types/app-types";
import { Permission } from "~/types/permission";
import { docTermsSchema, DocTermsType } from "~/util/data/schemas/document/doc-terms.schema";
import { AddressAutoCompleteFormField } from "~/util/hooks/fetchers/core/use-address-fetcher";
import { PaymentTermTemplateFormField } from "~/util/hooks/fetchers/docs/use-payment-term-template-fetcher";
import { TermsAndConditionsFormField } from "~/util/hooks/fetchers/docs/use-terms-and-conditions-fetcher";
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
  paymentTermsTemplatePerm,
  termsAndConditionsPerm,
}: {
  defaultValues: DocTermsType;
  allowEdit: boolean;
  paymentTermsTemplatePerm?:Permission;
  termsAndConditionsPerm?:Permission;
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
  const navigate = useNavigate()
  const formValues = form.getValues()
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
          <div className="info-grid">
              <PaymentTermTemplateFormField
                allowEdit={allowEdit}
                form={form}
                name="payment_term_template"
                label="Plantilla de Condiciones de Pago"
                {...(paymentTermsTemplatePerm?.create && {
                  addNew: () => {
                    navigate(
                      r.toRoute({ main: r.paymentTermsTemplate, routeSufix: ["new"] })
                    );
                  },
                })}
                {...(paymentTermsTemplatePerm?.view && {
                  href: route.toRoute({
                    main: r.paymentTermsTemplate,
                    routeSufix: [formValues.payment_term_template?.name || ""],
                    q: {
                      tab:"info",
                      id: formValues.payment_term_template?.uuid || "",
                    },
                  }),
                })}
              />
              <TermsAndConditionsFormField
                allowEdit={allowEdit}
                form={form}
                name="terms_and_conditions"
                label="Términos y condiciones"
                {...(termsAndConditionsPerm?.create && {
                  addNew: () => {
                    navigate(
                      r.toRoute({ main: r.termsAndConditions, routeSufix: ["new"] })
                    );
                  },
                })}
                {...(termsAndConditionsPerm?.view && {
                  href: route.toRoute({
                    main: r.termsAndConditions,
                    routeSufix: [formValues.terms_and_conditions?.name || ""],
                    q: {
                      tab:"info",
                      id: formValues.terms_and_conditions?.uuid || "",
                    },
                  }),
                })}
              />
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
