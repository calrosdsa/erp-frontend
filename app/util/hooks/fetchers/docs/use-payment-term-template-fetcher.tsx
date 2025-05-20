


import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import FormAutocompleteField, { AutocompleteFormProps } from "@/components/custom/select/form-autocomplete";
import { formatQuery } from "..";

type PaymentTermsTemplate = components["schemas"]["PaymentTermsTemplateDto"]
interface PaymentTermsTemplateFormProps extends Partial<AutocompleteFormProps<PaymentTermsTemplate, keyof PaymentTermsTemplate>> {
}

export const PaymentTermTemplateFormField = ({
  ...props
}:PaymentTermsTemplateFormProps ) => {
  const [fetcher, onChange] = usePaymentTermTemplate();
  return (
    <FormAutocompleteField
      {...props}
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      name={props.name || "payment_terms_template"}
      nameK="name"
    />
  );
};

export const usePaymentTermTemplate = () => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    results: components["schemas"]["PaymentTermsTemplateDto"][];
    actions: components["schemas"]["ActionDto"][];
  }>();
  const onChange = (e: string) => {
    const d: operations["payment-terms-template"]["parameters"]["query"] = {
      size: DEFAULT_SIZE,
      name: formatQuery(e),
    };
    fetcherDebounce.submit(
      {
        query: d as any,
        action: "get",
      },
      {
        method: "POST",
        encType: "application/json",
        debounceTimeout: DEFAULT_DEBOUNCE_TIME,
        action: r.toRoute({
            main:r.paymentTermsTemplate
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
