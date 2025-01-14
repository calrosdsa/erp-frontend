import { useEffect } from "react"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant"
import { components, operations } from "~/sdk"
import { PartyType } from "~/types/enums"
import { route } from "~/util/route"
import { usePermission } from "../useActions"
import { Control } from "react-hook-form"
import FormAutocomplete from "@/components/custom/select/FormAutocomplete"
import FormAutocompleteField from "@/components/custom/select/FormAutocompleteField"

export const PriceListAutocompleteFormField = ({
    allowEdit =true,
    required,
    control,
    label,
    // onSelect,
    name,
    isSelling,isBuying,
}:{
    allowEdit?: boolean;
    required?:boolean;
    control?: Control<any, any>;
    label?: string;
    name?:string
    isSelling?:boolean
    isBuying?:boolean
    // onSelect: (e: components["schemas"]["PriceListDto"]) => void;
  }) =>{
  const [fetcherDebounce, onChange] = usePriceListDebounceFetcher({isSelling,isBuying});
  return (
    <>
    <FormAutocompleteField
      data={fetcherDebounce.data?.priceLists || []}
      onValueChange={onChange}
      label={label}
      required={required}
      name={name || "priceList"}
      nameK="name"
      control={control}
      allowEdit={allowEdit}
      //   onSelect={onSelect}
      />
      </>
  );
}

export const PriceListAutocompleteForm = ({
    allowEdit =true,
    required,
    control,
    label,
    onSelect,
    name,
    isSelling,isBuying,
}:{
    allowEdit?: boolean;
    required?:boolean;
    control?: Control<any, any>;
    label?: string;
    name?:string
    isSelling?:boolean
    isBuying?:boolean
    onSelect: (e: components["schemas"]["PriceListDto"]) => void;
  }) =>{
  const [fetcherDebounce, onChange] = usePriceListDebounceFetcher({isSelling,isBuying});
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





export const usePriceListDebounceFetcher = ({isSelling,isBuying}:{
    isSelling?:boolean
    isBuying?:boolean
}) =>{
    const r = route
    const debounceFetcher = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        priceLists:components["schemas"]["PriceListDto"][],
    }>()

    const onChange = (e:string)=>{
        const d:operations["get-price-lists"]["parameters"]["query"] = {
            query:e,
            size:DEFAULT_SIZE,
            is_selling:String(isSelling),
            is_buying:String(isBuying)
        }
        debounceFetcher.submit({
            action:"get",
            query:d,
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