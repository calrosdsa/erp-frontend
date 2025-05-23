import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { components } from "~/sdk";
import { route } from "~/util/route";



export const ProjectSearch = ({placeholder}:{
  placeholder:string  
})  =>{
  const [projectsFetcher, onProjectChange] = useProjectFetcher();
  return (
    <AutocompleteSearch
    data={projectsFetcher.data?.projects || []}
    onValueChange={onProjectChange}
    nameK={"name"}
    valueK={"id"}
    placeholder={placeholder}
    queryName="projectName"
    queryValue="project"
    onSelect={() => {}}
  />
  )
}

export const useProjectFetcher = () => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    actions: components["schemas"]["ActionDto"][];
    projects: components["schemas"]["ProjectDto"][];
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
          main: partyTypeToJSON(PartyType.project),
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
