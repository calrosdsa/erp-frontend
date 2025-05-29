import FormAutocomplete from "@/components/custom/select/FormAutocomplete"
import { useEffect } from "react"
import { Control } from "react-hook-form"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { PartyType } from "~/types/enums"
import { route } from "~/util/route"

export const ItemAutocompleteForm = ({
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
    onSelect: (e: components["schemas"]["ItemDto"]) => void;
  }) =>{
  const [fetcherDebounce, onChange] = useItemDebounceFetcher();
  return (
    <FormAutocomplete
      data={fetcherDebounce.data?.items || []}
      onValueChange={onChange}
      label={label}
      required={required}
      name={name || "item"}
      nameK="name"
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
    />
  );
}

export const useItemDebounceFetcher = () =>{
    const r = route
    const debounceFetcher = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        items:components["schemas"]["ItemDto"][],
    }>()

    const onChange = (e:string)=>{
        debounceFetcher.submit({
            action:"get",
            query:e,
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.to(r.item)
        })
    }
    
 

    return [debounceFetcher,onChange] as const
}