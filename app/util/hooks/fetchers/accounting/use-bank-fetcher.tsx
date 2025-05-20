


import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import FormAutocompleteField, { AutocompleteFormProps } from "@/components/custom/select/form-autocomplete";
interface BankFormProps extends Partial<AutocompleteFormProps<any, keyof any>> {
}
export const BankForm = ({
  ...props
}: BankFormProps) => {
  const [fetcher, onChange] = useBankFetcher();
  return (
    <FormAutocompleteField
      {...props}
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      name={props.name || "bank"}
      nameK="name"
    />
  );
};

export const useBankFetcher = () => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    results: components["schemas"]["BankDto"][];
    actions: components["schemas"]["ActionDto"][];
  }>();
  const onChange = (e: string) => {
    const d: operations["bank"]["parameters"]["query"] = {
      size: DEFAULT_SIZE,
      name: e,
      
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
            main:r.bank
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
