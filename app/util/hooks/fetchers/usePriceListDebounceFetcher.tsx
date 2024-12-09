import { useEffect } from "react"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { PartyType } from "~/types/enums"
import { routes } from "~/util/route"
import { usePermission } from "../useActions"
import { Control } from "react-hook-form"
import FormAutocomplete from "@/components/custom/select/FormAutocomplete"

export const PriceListAutocompleteForm = ({
    allowEdit =true,
    required,
    control,
    label,
    onSelect,
    name
}:{
    allowEdit?: boolean;
    required?:boolean;
    control?: Control<any, any>;
    label?: string;
    name?:string
    onSelect: (e: components["schemas"]["PriceListDto"]) => void;
  }) =>{
  const [fetcherDebounce, onChange] = usePriceListDebounceFetcher();
  return (
    <FormAutocomplete
      data={fetcherDebounce.data?.priceLists || []}
      onValueChange={onChange}
      label={label}
      required={required}
      name={name || "priceList"}
      nameK="name"
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
    />
  );
}


export const usePriceListDebounceFetcher = () =>{
    const r = routes
    const debounceFetcher = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        priceLists:components["schemas"]["PriceListDto"][],
    }>()

    const onChange = (e:string)=>{
        debounceFetcher.submit({
            action:"get",
            query:e,
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.toRoute({
                main:r.priceList,
                routePrefix:[r.stockM]
            }),
        })
    }
    
 

    return [debounceFetcher,onChange] as const
}