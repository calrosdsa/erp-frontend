import { useEffect } from "react"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { PartyType } from "~/types/enums"
import { routes } from "~/util/route"
import { usePermission } from "../useActions"


export const useAccountLedgerDebounceFetcher = ({isGroup}:{
    //Pass  isGroup=true  for  filter only ledger groups
    isGroup:boolean
}) =>{
    const r = routes
    const debounceFetcher = useDebounceFetcher<{
        // actions:components["schemas"]["ActionDto"][],
        actions:components["schemas"]["ActionDto"][],
        accounts:components["schemas"]["LedgerDto"][]
    }>()

    const onChange = (e:string)=>{
        debounceFetcher.submit({
            action:"get",
            query:e,
            isGroup:isGroup,
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.chartOfAccount
        })
    }
    
 

    return [debounceFetcher,onChange] as const
}