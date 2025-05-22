import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { components } from "~/sdk";
import { route } from "~/util/route";
import { usePermission } from "../useActions";
import { useCreateSupplier } from "~/routes/home.supplier_/components/create-supplier";
import { Control } from "react-hook-form";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import FormAutocompleteField, { AutocompleteFormProps } from "@/components/custom/select/form-autocomplete";

type Supplier = components["schemas"]["SupplierDto"];
interface SupplierFormProps
  extends Partial<AutocompleteFormProps<Supplier, keyof Supplier>> {
  roleActions?: components["schemas"]["RoleActionDto"][];
  openModal?: () => void;
}

export const SupplierAutoCompleteForm = ({ ...props }: SupplierFormProps) => {
  const [fetcher, onChange] = useSupplierDebounceFetcher();
  const [permission] = usePermission({
    roleActions: props.roleActions,
    actions: fetcher.data?.actions,
  });
  return (
    <FormAutocompleteField
      {...props}
      data={fetcher.data?.suppliers || []}
      onValueChange={onChange}
      name={props.name || "supplier"}
      nameK="name"
      {...(permission.create && {
        addNew: () => {
          props.openModal?.();
        },
      })}
    />
  );
};

export const SupplierSearch = ({ placeholder }: { placeholder: string }) => {
  const [fetcher, onChange] = useSupplierDebounceFetcher();
  return (
    <AutocompleteSearch
      data={fetcher.data?.suppliers || []}
      onValueChange={onChange}
      nameK={"name"}
      valueK={"id"}
      placeholder={placeholder}
      queryName="partyName"
      queryValue="party"
      onSelect={() => {}}
    />
  );
};

export const useSupplierDebounceFetcher = () => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    actions: components["schemas"]["ActionDto"][];
    suppliers: components["schemas"]["SupplierDto"][];
  }>();

  const onChange = (e: string) => {
    fetcherDebounce.submit(
      {
        action: "get",
        query: e,
      },
      {
        method: "POST",
        debounceTimeout: DEFAULT_DEBOUNCE_TIME,
        encType: "application/json",
        action: r.to(route.supplier),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
