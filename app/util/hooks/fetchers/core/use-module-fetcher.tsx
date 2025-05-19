import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import { formatQuery } from "..";
import {
  Autocomplete,
  AutoCompleteProps,
} from "@/components/custom/select/autocomplete";

type Module = components["schemas"]["ModuleDto"];

interface ModuleAutocompleteProps
  extends Partial<AutoCompleteProps<Module, keyof Module>> {}
export const ModuleAutocomplete = ({ ...props }: ModuleAutocompleteProps) => {
  const [fetcher, onChange] = useModuleFetcher();

  return (
    <Autocomplete
      {...props}
      onValueChange={onChange}
      data={fetcher.data?.results || []}
      // isLoading={fetcher.state == "submitting"}
      nameK={"label"}
      placeholder="Modulo"
    />
  );
};

export const useModuleFetcher = () => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    results: components["schemas"]["ModuleDto"][];
    actions: components["schemas"]["ActionDto"][];
  }>();
  const onChange = (e: string) => {
    const d: operations["modules"]["parameters"] = {
      query: {
        size: DEFAULT_SIZE,
        label: formatQuery(e),
      },
    };
    fetcherDebounce.submit(
      {
        parameters: d as any,
        action: "list",
      },
      {
        method: "POST",
        encType: "application/json",
        debounceTimeout: DEFAULT_DEBOUNCE_TIME,
        action: r.to(r.module),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
