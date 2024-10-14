import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { routes } from "~/util/route"


export const useCustomerDebounceFetcher = () =>{
    const r = routes
    const fetcherDebounce = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        customers:components["schemas"]["CustomerDto"][],
    }>()

    const onChange = (e:string)=>{
        fetcherDebounce.submit({
            action:"get",
            query:e
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.customers
        })
    }
    return [fetcherDebounce,onChange] as const
}