import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import FormAutocompleteField, {
  AutocompleteFormProps,
} from "@/components/custom/select/FormAutocompleteField";
import { formatQuery } from "..";
import  {
  Autocomplete,
  AutoCompleteProps,
} from "@/components/custom/select/autocomplete";
import { SmartAutocomplete, SmartAutocompleteProps } from "@/components/form/smart-autocomplete";

type Profile = components["schemas"]["ProfileDto"];

interface ProfileSmartFormProps
  extends Partial<SmartAutocompleteProps<Profile, keyof Profile>> {
    excludeIds?:number[]
  }

  export const ProfileSmartField = ({ ...props }: ProfileSmartFormProps) => {
    const [fetcher, onChange] = useProfileFetcher();
    return (
      <SmartAutocomplete
        {...props}
        data={fetcher.data?.results.filter(t=>!props.excludeIds?.includes(t.id)) || []}
        onValueChange={(e) => {
          if(!props.disableAutocomplete){
            onChange(e);
          }
          props.onValueChange?.(e);
        }}
        nameK="full_name"
      />
    );
  };


interface ContactFormProps
  extends Partial<AutocompleteFormProps<Profile, keyof Profile>> {}

interface ContactAutocompleteProps
  extends Partial<AutoCompleteProps<Profile, keyof Profile>> {
    excludeIds?:number[]
  }

export const ProfileAutocomplete = ({ ...props }: ContactAutocompleteProps) => {
  const [fetcher, onChange] = useProfileFetcher();
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
      nameK="full_name"
    />
  );
};

export const ProfileAutoCompleteFormField = ({
  ...props
}: ContactFormProps) => {
  const [fetcher, onChange] = useProfileFetcher();
  return (
    <FormAutocompleteField
      {...props}
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      nameK="full_name"
      name={props.name || "profile"}
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

export const useProfileFetcher = () => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    results: components["schemas"]["ProfileDto"][];
    actions: components["schemas"]["ActionDto"][];
  }>();
  const onChange = (e: string) => {
    const d: operations["profiles"]["parameters"]["query"] = {
      size: DEFAULT_SIZE,
      full_name: formatQuery(e),
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
          main: r.user,
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
