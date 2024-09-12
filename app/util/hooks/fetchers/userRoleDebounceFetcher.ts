import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { routes } from "~/util/route"


export const useRoleDebounceFetcher = () =>{
    const r = routes
    const rolesFetcherDebounce = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        roles:components["schemas"]["RoleDto"][],
    }>()

    const onChange = (e:string)=>{
        rolesFetcherDebounce.submit({
            action:"get",
            query:e
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.roles
        })
    }
    

    return [rolesFetcherDebounce,onChange] as const
}