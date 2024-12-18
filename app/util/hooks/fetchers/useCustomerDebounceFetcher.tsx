import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { useCreateCustomer } from "~/routes/home.selling.customer_/components/create-customer";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import { usePermission } from "../useActions";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";

export const CustomerAutoCompleteForm = ({
  allowEdit,
  control,
  label,
  onSelect,
  roleActions,
}: {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  onSelect: (e: components["schemas"]["CustomerDto"]) => void;
  roleActions: components["schemas"]["RoleActionDto"][];
}) => {
  const [fetcher, onChange] = useCustomerDebounceFetcher();
  const createCustomer = useCreateCustomer();
  const [permission] = usePermission({
    roleActions,
    actions: fetcher.data?.actions,
  });
  return (
    <FormAutocomplete
      data={fetcher.data?.customers || []}
      onValueChange={onChange}
      label={label}
      name="customer"
      nameK="name"
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
  const r = routes;
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
  return [fetcherDebounce, onChange] as const;
};
