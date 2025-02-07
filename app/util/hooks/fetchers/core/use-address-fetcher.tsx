import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import FormAutocompleteField, { AutocompleteFormProps } from "@/components/custom/select/FormAutocompleteField";

type Address = components["schemas"]["AddressDto"]
interface AddressFormProps extends Partial<AutocompleteFormProps<Address, keyof Address>> {
}

export const AddressAutoCompleteFormField = ({
  ...props
}:AddressFormProps) => {
  const [fetcher, onChange] = useAddressFetcher();
  return (
    <FormAutocompleteField
      {...props}
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      nameK="title"
      name={props.name || "address"}
      onCustomDisplay={(e) => {
        return (
          <div className="flex flex-col">
            <span className=" font-medium">{e.title}</span>
            <span>{`${e.street_line1} ${e.street_line2}`}</span>
          </div>
        );
      }}
    />
  );
};

export const useAddressFetcher = () => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    results: components["schemas"]["AddressDto"][];
    actions: components["schemas"]["ActionDto"][];
  }>();
  const onChange = (e: string) => {
    const d: operations["get-addresses"]["parameters"]["query"] = {
      size: DEFAULT_SIZE,
      title: e,
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
          main:r.address,
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
