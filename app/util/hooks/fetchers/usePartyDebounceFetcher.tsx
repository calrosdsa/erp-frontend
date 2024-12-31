import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { components } from "~/sdk";
import { parties } from "~/util/party";
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


export const PartySearch = ({partyType}:{
  partyType:string
})=>{
  const [fetcher, onChange] = usePartyDebounceFetcher({partyType});
  return <AutocompleteSearch
    data={fetcher.data?.parties || []}
    nameK={"name"}
    onValueChange={onChange}
    valueK={"id"} 
    placeholder="Parte"
    queryValue={"party_id"}
    queryName={"party_name"}
  />
}


export const PartyTypeSearch = ()=>{
  const p = parties
  return <AutocompleteSearch
    data={p.paymentOptions}
    nameK={"name"}
    valueK={"value"} 
    placeholder="Tipo de Parte"
    queryValue={"party_type"}
    queryName={"party_type_name"}
  />
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
