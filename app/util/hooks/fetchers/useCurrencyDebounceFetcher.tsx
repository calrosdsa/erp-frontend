import FormAutocomplete from "@/components/custom/select/FormAutocomplete"
import { Control } from "react-hook-form"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { route } from "~/util/route"


export const CurrencyAutocompleteForm = ({
    allowEdit =true,
    control,
    label,
    onSelect,
    name
}:{
    allowEdit?: boolean;
    control?: Control<any, any>;
    label?: string;
    name?:string
    onSelect?: (e: components["schemas"]["CurrencyDto"]) => void;
  }) =>{
  const [currencyFetcher, onChange] = useCurrencyDebounceFetcher();
  return (
    <FormAutocomplete
      data={currencyFetcher.data?.currencies || []}
      onValueChange={onChange}
      label={label}
      name={name || "currency"}
      nameK="code"
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
    />
  );
}

export const useCurrencyDebounceFetcher = () =>{
    const r = route
    const fetcherDebounce = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        currencies:components["schemas"]["CurrencyDto"][],
    }>()

    const onChange = (e:string)=>{
        fetcherDebounce.submit({
            action:"get-currencies",
            query:e
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            relative:"path",
            action:r.apiData
        })
    }
    

    return [fetcherDebounce,onChange] as const
}