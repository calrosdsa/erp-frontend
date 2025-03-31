import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { route } from "~/util/route"


export const useCourtDebounceFetcher = () =>{
    const r = route
    const fetcherDebounce = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        courts:components["schemas"]["CourtDto"][],
    }>()

    const onChange = (e:string)=>{
        fetcherDebounce.submit({
            action:"get",
            query:e
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.to(r.court)
        })
    }
    return [fetcherDebounce,onChange] as const
}