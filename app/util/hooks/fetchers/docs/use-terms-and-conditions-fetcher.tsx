


import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";

export const TermsAndConditionsForm = ({
  allowEdit,
  control,
  label,
  name,
  onSelect,
  onClear,
}: {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  name?: string;
  onSelect?: (e: components["schemas"]["TermsAndConditionsDto"]) => void;
  onClear?:()=>void
}) => {
  const [fetcher, onChange] = useTermsAndConditions();
  return (
    <FormAutocomplete
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      label={label}
      name={name || "terms_and_conditions"}
      nameK="name"
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
      onClear={onClear}
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
            main:r.termsAndConditions
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
