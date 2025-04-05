import FormAutocomplete from "@/components/custom/select/FormAutocomplete"
import { AutocompleteFormProps } from "@/components/custom/select/FormAutocompleteField"
import { SmartAutocomplete } from "@/components/form/smart-autocomplete"
import { Control } from "react-hook-form"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { route } from "~/util/route"


type Currency = components["schemas"]["CurrencyDto"];
interface CurrencyFormProps
  extends Partial<AutocompleteFormProps<Currency, keyof Currency>> {
}
interface CurrencySmartFormProps
  extends Partial<AutocompleteFormProps<Currency, keyof Currency>> {
}
export const CurrencySmartAutocomplete = ({ ...props }: CurrencySmartFormProps) => {
  const [fetcher, onChange] = useCurrencyDebounceFetcher();

  return (
    <SmartAutocomplete
      {...props}
      label={props.label ? props.label : "Divisa"}
      data={fetcher.data?.currencies || []}
      onValueChange={onChange}
      name={props.name || "currency"}
      nameK="code"
    />
  );
};

export const CurrencyAutocompleteForm = ({...props}:CurrencyFormProps) =>{
  const [currencyFetcher, onChange] = useCurrencyDebounceFetcher();
  return (
    <FormAutocomplete
        {...props}
      data={currencyFetcher.data?.currencies || []}
      onValueChange={onChange}
      name={props.name || "currency"}
      nameK="code"
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