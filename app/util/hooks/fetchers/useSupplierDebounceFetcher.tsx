import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import { usePermission } from "../useActions";
import { useCreateSupplier } from "~/routes/home.buying.supplier_/components/create-supplier";
import { Control } from "react-hook-form";

export const SupplierAutoCompleteForm = ({
  allowEdit,
  control,
  label,
  onSelect,
  roleActions,
  required,
}: {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  required?:boolean;
  onSelect: (e: components["schemas"]["SupplierDto"]) => void;
  roleActions: components["schemas"]["RoleActionDto"][];
}) => {
  const [fetcher, onChange] = useSupplierDebounceFetcher();
  const createCustomer = useCreateSupplier();
  const [permission] = usePermission({
    roleActions,
    actions: fetcher.data?.actions,
  });
  return (
    <FormAutocomplete
      data={fetcher.data?.suppliers || []}
      onValueChange={onChange}
      label={label}
      required={required}
      name="supplier"
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

export const useSupplierDebounceFetcher = () => {
  const r = routes;
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
        action: r.toRoute({
          main: partyTypeToJSON(PartyType.supplier),
          routePrefix: [r.buyingM],
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
