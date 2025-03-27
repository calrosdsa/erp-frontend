import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { components } from "~/sdk";
import { route } from "~/util/route";

export const useRoleDebounceFetcher = () => {
  const r = route;
  const rolesFetcherDebounce = useDebounceFetcher<{
    actions: components["schemas"]["ActionDto"][];
    roles: components["schemas"]["RoleDto"][];
  }>();

  const onChange = (e: string) => {
    rolesFetcherDebounce.submit(
      {
        action: "get",
        query: e,
      },
      {
        method: "POST",
        debounceTimeout: DEFAULT_DEBOUNCE_TIME,
        encType: "application/json",
        action: route.to(r.role),
      }
    );
  };

  return [rolesFetcherDebounce, onChange] as const;
};
