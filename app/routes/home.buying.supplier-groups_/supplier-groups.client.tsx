import { useLoaderData, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { groupColumns } from "@/components/custom/table/columns/group/group-columns"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { useCreateGroup } from "../home.groups/components/create-group"
import { PartyType } from "~/types/enums"


export default function SupplierGroupsClient(){
    const globalState = useOutletContext<GlobalState>()
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
            columns={groupColumns({})}
            metaActions={{
                meta:{
                    ...(permission?.create && {
                        addNew:()=>{
                            createGroup.openDialog({partyType:PartyType.PARTY_SUPPLIER_GROUP})
                        }
                    })
                }
            }}
            />
        </div>
    )
}