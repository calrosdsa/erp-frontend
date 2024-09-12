import { useEffect } from "react"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { PartyType } from "~/types/enums"
import { routes } from "~/util/route"
import { usePermission } from "../useActions"


export const useTaxDebounceFetcher = () =>{
    const r = routes
    const debounceFetcher = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        taxes:components["schemas"]["TaxDto"][],
    }>()

    const onChange = (e:string)=>{
        debounceFetcher.submit({
            action:"get",
            query:e,
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.taxes
        })
    }
    
 

    return [debounceFetcher,onChange] as const
}