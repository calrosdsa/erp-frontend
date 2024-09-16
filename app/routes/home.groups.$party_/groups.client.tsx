import { useLoaderData, useOutletContext, useParams } from "@remix-run/react"
import { DataTable } from "@/components/custom/table/CustomTable"
import { groupColumns } from "@/components/custom/table/columns/group/group-columns"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { PartyType } from "~/types/enums"
import { useCreateGroup } from "./components/create-group"
import { loader } from "./route"


export default function GroupsClient(){
    const globalState = useOutletContext<GlobalState>()
    const params = useParams()
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.roleActions
    })
    const createGroup = useCreateGroup()
    return (
        <div>
            <DataTable
            data={paginationResult?.results || []}
            columns={groupColumns({party:params.party || "" })}
            metaActions={{
                meta:{
                    ...(permission?.create && {
                        addNew:()=>{
                            if(params.party){
                                createGroup.openDialog({partyType:params.party})
                            }
                        }
                    })
                }
            }}
            />
        </div>
    )
}