import { useEffect } from "react";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import { usePermission } from "../useActions";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { Control } from "react-hook-form";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useCreateGroup } from "~/routes/home.group.$party_/components/create-group";

export const GroupAutocompleteForm = ({
  allowEdit = true,
  control,
  label,
  onSelect,
  name,
  isGroup,
  partyType,
  roleActions,
  href,
}: {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  name?: string;
  onSelect: (e: components["schemas"]["GroupDto"]) => void;
  isGroup: boolean;
  partyType: string;
  href?:string
  roleActions?: components["schemas"]["RoleActionDto"][];
}) => {
  const [fetcherDebounce, onChange] = useGroupDebounceFetcher({
    isGroup,
    partyType,
  });
  const [permission] = usePermission({
    actions:fetcherDebounce.data?.actions,
    roleActions,
  });
  const createGroup = useCreateGroup();

  return (
    <FormAutocomplete
      data={fetcherDebounce.data?.groups || []}
      onValueChange={onChange}
      label={label}
      name={name || "group"}
      nameK="name"
      href={href}
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
      {...(permission?.create && {
        addNew: () =>
          createGroup.openDialog({
            partyType: partyType,
          }),
      })}
    />
  );
};

export const useGroupDebounceFetcher = ({
  partyType,
  isGroup,
}: {
  partyType: string;
  isGroup?: boolean;
}) => {
  const r = routes;
  const debounceFetcher = useDebounceFetcher<{
    actions: components["schemas"]["ActionDto"][];
    groups: components["schemas"]["GroupDto"][];
  }>();

  const onChange = (e: string) => {
    debounceFetcher.submit(
      {
        action: "get",
        query: e,
        partyType: partyType,
        isGroup: isGroup ? isGroup : false,
      },
      {
        method: "POST",
        debounceTimeout: DEFAULT_DEBOUNCE_TIME,
        encType: "application/json",
        action: r.toRoute({
          main: partyType,
          routePrefix: [r.group],
        }),
      }
    );
  };

  return [debounceFetcher, onChange] as const;
};
