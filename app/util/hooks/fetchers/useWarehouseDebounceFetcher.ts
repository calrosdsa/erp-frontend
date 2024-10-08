import { useEffect } from "react"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { PartyType } from "~/types/enums"
import { routes } from "~/util/route"
import { usePermission } from "../useActions"


export const useWarehouseDebounceFetcher = ({isGroup}:{
    isGroup:boolean
}) =>{
    const r = routes
    const debounceFetcher = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        warehouses:components["schemas"]["WareHouseDto"][],
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
            action:r.warehouses
        })
    }
    
 

    return [debounceFetcher,onChange] as const
}