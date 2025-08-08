import { Autocomplete, AutoCompleteProps } from "@/components/custom/select/autocomplete";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import { SmartAutocomplete } from "@/components/form/smart-autocomplete";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { components } from "~/sdk";
import { route } from "~/util/route";

type Project = components["schemas"]["ProjectDto"];
interface ProjectAutocompletProps
  extends Partial<AutoCompleteProps<Project, keyof Project>> {
  
}
interface ProjectSmartFieldProps {
  onValueChange?: (value: string) => void;
}

export const ProjectSmartField = ({ ...props }: ProjectSmartFieldProps) => {
  const [fetcher, onChange] = useProjectFetcher();
  return (
    <SmartAutocomplete
      {...props}
      data={fetcher.data?.projects || []}
      onValueChange={(e) => {
        onChange(e);
        props.onValueChange?.(e);
      }}
      nameK="name"
      name="project"
      label="Project"
      required
    />
  );
};
export const ProjectAutocomplete = ({
  ...props
}:ProjectAutocompletProps)=>{
  const [fetcher,onChange] = useProjectFetcher()
  return (
    <Autocomplete
    {...props}
    data={fetcher.data?.projects || []}
    onValueChange={onChange}
    nameK="name"
    />
  )
}

export const ProjectSearch = ({ placeholder }: { placeholder: string }) => {
  const [projectsFetcher, onProjectChange] = useProjectFetcher();
  return (
    <AutocompleteSearch
      data={projectsFetcher.data?.projects || []}
      onValueChange={onProjectChange}
      nameK={"name"}
      valueK={"id"}
      placeholder={placeholder}
      queryName="project_name"
      queryValue="project_id"
      onSelect={() => {}}
    />
  );
};

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
        action: route.to(route.project),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
