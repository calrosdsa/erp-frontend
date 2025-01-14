import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { components } from "~/sdk";
import { route } from "~/util/route";

export const CostCenterSearch = ({placeholder}:{
  placeholder:string  
})  =>{
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
  )
}


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
        action: r.toRoute({
          main: partyTypeToJSON(PartyType.costCenter),
          routePrefix:[r.accountingM],
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
