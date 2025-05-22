import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_ID, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import { formatQuery } from "..";
import {
  SmartAutocomplete,
  SmartAutocompleteProps,
} from "@/components/form/smart-autocomplete";
import { OpenModal } from "~/types";
import { usePermission } from "../../useActions";

type WorkSpace = components["schemas"]["WorkSpaceDto"];

interface WorkspaceFormProps
  extends Partial<SmartAutocompleteProps<WorkSpace, keyof WorkSpace>> {
  openModal: OpenModal;
  roleActions: components["schemas"]["RoleActionDto"][];
}
export const WorkspaceForm = ({ ...props }: WorkspaceFormProps) => {
  const [fetcher, onChange] = useWokspaceFetcher();
  const [permission] = usePermission({
    actions: fetcher.data?.actions || [],
    roleActions: props.roleActions,
  });
  return (
    <SmartAutocomplete
      {...props}
      onValueChange={onChange}
      data={fetcher.data?.results || []}
      label={props.label ? props.label : "Espacio de Trabajo"}
      isLoading={fetcher.state == "submitting"}
      name={"workspace"}
      nameK="name"
      // addNew={() => {
      //   props.openModal(route.workspace, DEFAULT_ID);
      // }}
      {...(permission.create && {
        addNew: () => {
          props.openModal(route.workspace, DEFAULT_ID);
        },
      })}
      navigate={(e) => props.openModal(route.workspace, e)}
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
