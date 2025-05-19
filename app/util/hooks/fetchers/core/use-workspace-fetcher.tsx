import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import { formatQuery } from "..";
import {
  SmartAutocomplete,
  SmartAutocompleteProps,
} from "@/components/form/smart-autocomplete";
import { OpenModal } from "~/types";

type WorkSpace = components["schemas"]["WorkSpaceDto"];

interface WorkspaceFormProps
  extends Partial<SmartAutocompleteProps<WorkSpace, keyof WorkSpace>> {
    openModal:OpenModal
  }
export const WorkspaceForm = ({
  ...props
}: WorkspaceFormProps) => {
  const [fetcher, onChange] = useWokspaceFetcher();

  return (
    <SmartAutocomplete
      {...props}
      onValueChange={onChange}
      data={fetcher.data?.results || []}
      label={props.label ? props.label : "Espacio de Trabajo"}
      isLoading={fetcher.state == "submitting"}
      name={"workspace"}
      nameK="name"
      navigate={(e)=>props.openModal(route.workspace,e)}
    />
  );
};

export const useWokspaceFetcher = () => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    results: components["schemas"]["WorkSpaceDto"][];
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
        action: r.to(r.workspace),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
