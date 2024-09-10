import { useEffect } from "react"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { PartyType } from "~/types/enums"
import { routes } from "~/util/route"
import { usePermission } from "../useActions"


export const useItemPriceForOrders = ({isSelling,isBuying,currency}:{
    isSelling?:boolean
    isBuying?:boolean
    currency:string
}) =>{
    const r = routes
    const debounceFetcher = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        itemPriceForOrders:components["schemas"]["ItemPriceDto"][],
    }>()

    const onChange = (e:string)=>{
        debounceFetcher.submit({
            action:"item-price-for-orders",
            query:e,
            currency:currency,
            isBuying:isBuying || false,
            isSelling:isSelling || false,
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.itemPrices
        })
    }
    
 

    return [debounceFetcher,onChange] as const
}