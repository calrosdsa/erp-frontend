import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { roleTemplateColumns } from "@/components/custom/table/columns/admin/role-template-columns"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"
import { NewRoleTemplate, useNewRoleTemplate } from "./use-new-role-template"


export default function RoleTemplateClient(){
    const {paginationResult} = useLoaderData<typeof loader>()
    const newRoleTemplate = useNewRoleTemplate()
    setUpToolbar(()=>{
        return {
            addNew:()=>{
                newRoleTemplate.onOpenChange(true)
            }
        }
    },[])
    return (
        <div>
            {newRoleTemplate.open && 
            <NewRoleTemplate
            open={newRoleTemplate.open}
            onOpenChange={newRoleTemplate.onOpenChange}
            />
            }
            <DataTable
            data={paginationResult?.results || []}
            columns={roleTemplateColumns()}
            paginationOptions={{
                rowCount:paginationResult?.total,
            }}
            />
        </div>
    )
}