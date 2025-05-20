import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { useCreateCustomer } from "~/routes/home.customer_/components/create-customer";
import { components } from "~/sdk";
import { route } from "~/util/route";
import { usePermission } from "../useActions";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import FormAutocompleteField, {
  AutocompleteFormProps,
} from "@/components/custom/select/form-autocomplete";
import {
  SmartAutocomplete,
  SmartAutocompleteProps,
} from "@/components/form/smart-autocomplete";

interface CustomerSmartAutocomplete
  extends Partial<SmartAutocompleteProps<Customer, keyof Customer>> {}
export const CustomerSmartAutocomplete = ({
  ...props
}: CustomerSmartAutocomplete) => {
  const [fetcher, onChange] = useCustomerDebounceFetcher();

  return (
    <SmartAutocomplete
      {...props}
      label={props.label ? props.label : "Cliente"}
      data={fetcher.data?.customers || []}
      onValueChange={onChange}
      nameK="name"
      name="customer"
    />
  );
};

type Customer = components["schemas"]["CustomerDto"];
interface CustomerFormProps
  extends Partial<AutocompleteFormProps<Customer, keyof Customer>> {
  roleActions?: components["schemas"]["RoleActionDto"][];
  openModal?: () => void;
}

export const CustomerAutoCompleteForm = ({
  roleActions,
  ...props
}: CustomerFormProps) => {
  const [fetcher, onChange] = useCustomerDebounceFetcher();
  const createCustomer = useCreateCustomer();
  const [permission] = usePermission({
    roleActions,
    actions: fetcher.data?.actions,
  });
  return (
    <FormAutocompleteField
      {...props}
      data={fetcher.data?.customers || []}
      onValueChange={onChange}
      name={props.name || "customer"}
      placeholder="Buscar o crear un nuevo cliente"
      loading={fetcher.state == "submitting"}
      nameK="name"
      {...(permission.create && {
        addNew: () => {
          props.openModal?.();
        },
      })}
    />
  );
};

export const CustomerSearch = ({ placeholder }: { placeholder: string }) => {
  const [fetcher, onChange] = useCustomerDebounceFetcher();
  return (
    <AutocompleteSearch
      data={fetcher.data?.customers || []}
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

export const useCustomerDebounceFetcher = () => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    actions: components["schemas"]["ActionDto"][];
    customers: components["schemas"]["CustomerDto"][];
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
        action: r.toRoute({
          main: r.customer,
        }),
      }
    );
  };
  return [
    fetcherDebounce,
    onChange,
    fetcherDebounce.state == "submitting",
  ] as const;
};
