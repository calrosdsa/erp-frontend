import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components, operations } from "~/sdk"
import { route } from "~/util/route"


export const useCourtDebounceFetcher = () =>{
    const r = route
    const fetcherDebounce = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        courts:components["schemas"]["CourtDto"][],
    }>()

    const onChange = (e:string)=>{
        const d: operations["courts"]["parameters"]["query"] = {
              size: "100",
              name: e,
            };
        fetcherDebounce.submit({
            action:"get",
            query:d,
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.to(r.court)
        })
    }
    return [fetcherDebounce,onChange] as const
}