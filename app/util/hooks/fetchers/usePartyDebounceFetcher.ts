import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { components } from "~/sdk";
import { routes } from "~/util/route";

export const usePartyDebounceFetcher = ({
  partyType,
}: {
  partyType?: string;
}) => {
  const r = routes;
  const fetcherDebounce = useDebounceFetcher<{
    // actions:components["schemas"]["ActionDto"][],
    parties: components["schemas"]["PartyDto"][];
  }>();

  const onChange = (e: string) => {
    if (partyType != undefined) {
      fetcherDebounce.submit(
        {
          action: "parties",
          partyType: partyType,
          query: e,
        },
        {
          method: "POST",
          debounceTimeout: DEFAULT_DEBOUNCE_TIME,
          encType: "application/json",
          action: r.party,
        }
      );
    }
  };
  return [fetcherDebounce, onChange] as const;
};
