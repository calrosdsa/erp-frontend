import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";

export const AddressAutoCompleteForm = ({
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
  onSelect?: (e: components["schemas"]["AddressDto"]) => void;
  onClear?:()=>void
}) => {
  const [fetcher, onChange] = useAddressFetcher();
  return (
    <FormAutocomplete
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      label={label}
      name={name || "address"}
      nameK="title"
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
      onClear={onClear}
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
        action: r.address,
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
