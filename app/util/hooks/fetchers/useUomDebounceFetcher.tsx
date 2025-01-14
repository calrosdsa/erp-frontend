import { useEffect } from "react"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { PartyType } from "~/types/enums"
import { route } from "~/util/route"
import { usePermission } from "../useActions"
import { Control } from "react-hook-form"
import FormAutocomplete from "@/components/custom/select/FormAutocomplete"

export const UomAutocompleteForm = ({
    allowEdit =true,
    required,
    control,
    label,
    onSelect,
    name
}:{
    allowEdit?: boolean;
    control?: Control<any, any>;
    label?: string;
    name?:string
    required?:boolean;
    onSelect: (e: components["schemas"]["UOMDto"]) => void;
  }) =>{
  const [fetcherDebounce, onChange] = useUomDebounceFetcher();
  return (
    <FormAutocomplete
      data={fetcherDebounce.data?.uoms || []}
      onValueChange={onChange}
      label={label}
      name={name || "uom"}
      nameK="name"
      required={required}
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
    />
  );
}

export const useUomDebounceFetcher = () =>{
    const r = route
    const debounceFetcher = useDebounceFetcher<{
        // actions:components["schemas"]["ActionDto"][],
        uoms:components["schemas"]["UOMDto"][],
    }>()

    const onChange = (e:string)=>{
        debounceFetcher.submit({
            action:"get",
            query:e,
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.uom
        })
    }
    
 

    return [debounceFetcher,onChange] as const
}