import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { useCreateCustomer } from "~/routes/home.selling.customer_/components/create-customer";
import { components } from "~/sdk";
import { route } from "~/util/route";
import { usePermission } from "../useActions";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import FormAutocompleteField from "@/components/custom/select/FormAutocompleteField";

export const CustomerAutoCompleteForm = ({
  allowEdit,
  control,
  label,
  onSelect,
  onClear,
  roleActions,
  name,
}: {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  name?:string;
  onSelect?: (e: components["schemas"]["CustomerDto"]) => void;
  onClear?:()=>void
  roleActions?: components["schemas"]["RoleActionDto"][];
}) => {
  const [fetcher, onChange] = useCustomerDebounceFetcher();
  const createCustomer = useCreateCustomer();
  const [permission] = usePermission({
    roleActions,
    actions: fetcher.data?.actions,
  });
  return (
    <FormAutocompleteField
      data={fetcher.data?.customers || []}
      onValueChange={onChange}
      label={label}
      name={name || "customer"}
      nameK="name"
      onClear={onClear}
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
      {...(permission.create && {
        addNew: () => {
          createCustomer.openDialog({});
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
          main: partyTypeToJSON(PartyType.customer),
          routePrefix: [r.sellingM],
        }),
      }
    );
  };
  return [fetcherDebounce, onChange,fetcherDebounce.state == "submitting"] as const;
};
