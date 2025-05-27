import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import FormAutocompleteField from "@/components/custom/select/form-autocomplete";
import { formatQuery } from "..";
import  {
  Autocomplete,
  AutoCompleteProps,
} from "@/components/custom/select/autocomplete";

type Contact = components["schemas"]["ContactDto"];


interface ContactAutocompleteProps
  extends Partial<AutoCompleteProps<Contact, keyof Contact>> {
    excludeIds:number[]
  }

export const ContactAutocomplete = ({ ...props }: ContactAutocompleteProps) => {
  const [fetcher, onChange] = useContactFetcher();
  return (
    <Autocomplete
      {...props}
      data={fetcher.data?.results.filter(t=>!props.excludeIds?.includes(t.id)) || []}
      onValueChange={(e) => {
        if(!props.disableAutocomplete){
          onChange(e);
        }
        props.onValueChange?.(e);
      }}
      nameK="name"
    />
  );
};

export const ContactAutoCompleteFormField = ({
  ...props
}: ContactAutocompleteProps) => {
  const [fetcher, onChange] = useContactFetcher();
  return (
    <FormAutocompleteField
      {...props}
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      nameK="name"
      name={props.name || "address"}
      //   onCustomDisplay={(e) => {
      //     return (
      //       <div className="flex flex-col">
      //         <span className=" font-medium">{e.name}</span>
      //         <span>{`${e.}`}</span>
      //       </div>
      //     );
      //   }}
    />
  );
};

export const useContactFetcher = () => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    results: components["schemas"]["ContactDto"][];
    actions: components["schemas"]["ActionDto"][];
  }>();
  const onChange = (e: string) => {
    const d: operations["contacts"]["parameters"]["query"] = {
      size: DEFAULT_SIZE,
      name: formatQuery(e),
      // name:e
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
          main: r.contact,
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
