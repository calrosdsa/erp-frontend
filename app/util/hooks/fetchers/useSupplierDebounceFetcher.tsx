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

export const SupplierAutoCompleteForm = ({
  allowEdit,
  control,
  label,
  onSelect,
  onClear,
  roleActions,
  required,
  className,
  name,
}: {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  required?:boolean;
  onSelect: (e: components["schemas"]["SupplierDto"]) => void;
  onClear?:()=>void,
  roleActions?: components["schemas"]["RoleActionDto"][];
  className?:string
  name?:string
}) => {
  const [fetcher, onChange] = useSupplierDebounceFetcher();
  const createSupplier = useCreateSupplier();
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
      name={name || "supplier"}
      nameK="name"
      control={control}
      className={className}
      onClear={onClear}
      allowEdit={allowEdit}
      onSelect={onSelect}
      {...(permission.create && {
        addNew: () => {
          createSupplier.openDialog({});
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
        action: r.toRoute({
          main: partyTypeToJSON(PartyType.supplier),
          routePrefix: [r.buyingM],
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
