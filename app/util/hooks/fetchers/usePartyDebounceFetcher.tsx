import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { components } from "~/sdk";
import { routes } from "~/util/route";


interface PartyAutocompleteProps {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  partyType:string;
  onSelect: (e: components["schemas"]["PartyDto"]) => void;
}

export const PartyAutocompleteForm =({
  allowEdit,
  control,
  label,
  partyType,
  onSelect,
}: PartyAutocompleteProps) => {
  const [fetcher, onChange] = usePartyDebounceFetcher({partyType});

  return (
    <FormAutocomplete
      data={fetcher.data?.parties || []}
      onValueChange={onChange}
      label={label}
      name="party"
      nameK="name"
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
    />
  );
}


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
