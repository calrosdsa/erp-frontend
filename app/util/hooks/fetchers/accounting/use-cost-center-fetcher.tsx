import { Autocomplete, AutoCompleteProps } from "@/components/custom/select/autocomplete";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import FormAutocompleteField from "@/components/custom/select/form-autocomplete";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { components } from "~/sdk";
import { route } from "~/util/route";

type CostCenter = components["schemas"]["CostCenterDto"];
interface CostCenterAutocompleteProps
  extends Partial<AutoCompleteProps<CostCenter, keyof CostCenter>> {
  roleActions?: components["schemas"]["RoleActionDto"][];
}

export const CostCenterFormField = ({
  name,
  roleActions,
  ...props
}: CostCenterAutocompleteProps) => {
  const [fetcherDebounce, onChange] = useCostCenterFetcher();
  return (
    <FormAutocompleteField
      {...props}
      data={fetcherDebounce.data?.costCenters || []}
      onValueChange={onChange}
      name={name || "costCenter"}
      nameK="name"
    />
  );
};


export const CostCenterAutocomplete = ({
  ...props
}:CostCenterAutocompleteProps)=>{
  const [fetcher,onChange] = useCostCenterFetcher()
  return (
    <Autocomplete
      {...props}
      data={fetcher.data?.costCenters || []}
      onValueChange={onChange}
      nameK="name"
    />
  )
}

export const CostCenterSearch = ({ placeholder }: { placeholder: string }) => {
  const [costCenterFetcher, onCostCenterChange] = useCostCenterFetcher();
  return (
    <AutocompleteSearch
      data={costCenterFetcher.data?.costCenters || []}
      onValueChange={onCostCenterChange}
      nameK={"name"}
      valueK={"id"}
      placeholder={placeholder}
      queryName="costCenterName"
      queryValue="costCenter"
      onSelect={() => {}}
    />
  );
};

export const useCostCenterFetcher = () => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    actions: components["schemas"]["ActionDto"][];
    costCenters: components["schemas"]["CostCenterDto"][];
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
        action: route.to(route.costCenter),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
