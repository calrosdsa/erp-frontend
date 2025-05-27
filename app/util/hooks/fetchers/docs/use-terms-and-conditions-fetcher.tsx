import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import FormAutocompleteField from "@/components/custom/select/form-autocomplete";
import { formatQuery } from "..";
import { AutoCompleteProps } from "@/components/custom/select/autocomplete";

type TermsAndConditions = components["schemas"]["TermsAndConditionsDto"];
interface TermsAndConditionsProps
  extends Partial<
    AutoCompleteProps<TermsAndConditions, keyof TermsAndConditions>
  > {}
export const TermsAndConditionsFormField = ({
  ...props
}: TermsAndConditionsProps) => {
  const [fetcher, onChange] = useTermsAndConditions();
  return (
    <FormAutocompleteField
      {...props}
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      name={props.name || "terms_and_conditions"}
      nameK="name"
    />
  );
};

export const useTermsAndConditions = () => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    results: components["schemas"]["TermsAndConditionsDto"][];
    actions: components["schemas"]["ActionDto"][];
  }>();
  const onChange = (e: string) => {
    const d: operations["terms-and-conditions"]["parameters"]["query"] = {
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
          main: r.termsAndConditions,
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
