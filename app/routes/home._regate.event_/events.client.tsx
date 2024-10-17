import { useLoaderData, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { DataTable } from "@/components/custom/table/CustomTable"
import { eventBookingsColumns } from "@/components/custom/table/columns/regate/event-columns"
import { routes } from "~/util/route"
import { useCreateEvent } from "./components/use-create-event"

export default function EventsClient(){
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const globalState = useOutletContext<GlobalState>()
    const createEvent = useCreateEvent()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions,
    })
    return (
        <div>
            <DataTable
            data={paginationResult?.results || []}
            columns={eventBookingsColumns()}
            metaActions={{
                meta:{
                    ...(permission?.create && {
                        addNew:()=>{
                            createEvent.onOpenChange(true)
                        }
                    })
                }
            }}            
            />
        </div>
    )
}