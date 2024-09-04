import { useLoaderData, useOutletContext } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { roleColumns } from "@/components/custom/table/columns/user/role-columns"
import { GlobalState } from "~/types/app"
import { usePermission } from "~/util/hooks/useActions"
import { CreateRole, useCreateRole } from "./components/create-rol"


export default function RolesClient(){
    const {paginationResult,actions} = useLoaderData<typeof loader>()
    const createRole = useCreateRole()
    const globalState = useOutletContext<GlobalState>()
    const [permission] = usePermission({
        actions:actions,
        roleActions:globalState.role?.RoleActions
    })
    return (
        <>
        {createRole.open &&
        <CreateRole
        open={createRole.open}
        onOpenChange={createRole.onOpenChange}
        />
        }
            {/* RolesCLient
            {JSON.stringify(data)} */}
            <DataTable
            metaActions={{
                meta:{
                    ...(permission?.create && {
                        addNew:()=>{
                            createRole.openDialog({})
                        },
                    })
                }
            }}
            data={paginationResult?.results || []}
            columns={roleColumns({})}
            />
        </>
    )
}