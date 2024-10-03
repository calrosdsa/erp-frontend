import { useEffect } from "react"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { routes } from "~/util/route"
import { usePermission } from "../useActions"
import { PartyType } from "~/gen/common"


export const useGroupDebounceFetcher = ({partyType}:{
    partyType:PartyType
}) =>{
    const r = routes
    const debounceFetcher = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        groups:components["schemas"]["GroupDto"][],
    }>()

    const onChange = (e:string)=>{
        debounceFetcher.submit({
            action:"get",
            query:e,
            partyType:partyType.toString(),
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.toGroupsByParty(partyType)
        })
    }
    
 

    return [debounceFetcher,onChange] as const
}