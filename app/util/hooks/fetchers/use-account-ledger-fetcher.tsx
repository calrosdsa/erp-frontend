import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { Control } from "react-hook-form";
import FormAutocompleteField, {
  AutocompleteFormProps,
} from "@/components/custom/select/form-autocomplete";
import { formatQuery } from ".";
import {
  Autocomplete,
  AutoCompleteProps,
} from "@/components/custom/select/autocomplete";

type Ledger = components["schemas"]["LedgerDto"];
interface LedgerAutcompleteProps
  extends Partial<AutoCompleteProps<Ledger, keyof Ledger>> {
  isGroup?: boolean;
  roleActions?: components["schemas"]["RoleActionDto"][];
}

export const LedgerAutocompleteFormField = ({
  name,
  isGroup = false,
  roleActions,
  ...props
}: LedgerAutcompleteProps) => {
  const [fetcherDebounce, onChange] = useAccountLedgerFetcher({
    isGroup,
  });

  return (
    <FormAutocompleteField
      {...props}
      data={fetcherDebounce.data?.results || []}
      onValueChange={onChange}
      name={name || "ledger"}
      nameK="name"
    />
  );
};

export const LedgerAutcomplete = ({
  isGroup,
  ...props
}: LedgerAutcompleteProps) => {
  const [fetcher, onChange] = useAccountLedgerFetcher({
    isGroup,
  });
  return (
    <Autocomplete
      {...props}
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      nameK="name"
    />
  );
};

export const LedgerAutocompleteForm = ({
  allowEdit = true,
  control,
  label,
  onSelect,
  name,
  isGroup = false,
  roleActions,
  onClear,
}: {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  name?: string;
  onSelect: (e: components["schemas"]["LedgerDto"]) => void;
  isGroup?: boolean;
  roleActions?: components["schemas"]["RoleActionDto"][];
  onClear?: () => void;
}) => {
  const [fetcherDebounce, onChange] = useAccountLedgerFetcher({
    isGroup,
  });
  // const [permission] = usePermission({
  //   actions:fetcherDebounce.data?.actions,
  //   roleActions,
  // });

  return (
    <FormAutocomplete
      data={fetcherDebounce.data?.results || []}
      onValueChange={onChange}
      label={label}
      name={name || "ledger"}
      nameK="name"
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
      onClear={onClear}
    />
  );
};

export const useAccountLedgerFetcher = ({
  isGroup = false,
}: {
  //Pass  isGroup=true  for  filter only ledger groups
  isGroup?: boolean;
}) => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    results: components["schemas"]["LedgerDto"][];
    actions: components["schemas"]["ActionDto"][];
  }>();
  const onChange = (e: string) => {
    const d: operations["get-acconts"]["parameters"]["query"] = {
      size: DEFAULT_SIZE,
      name: formatQuery(e),
      is_group: String(isGroup),
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
          main: r.ledger,
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
