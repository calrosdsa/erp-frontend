import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { roleColumns } from "@/components/custom/table/columns/user/role-columns"


export default function RolesClient(){
    const {data} = useLoaderData<typeof loader>()
    return (
        <div>
            {/* RolesCLient
            {JSON.stringify(data)} */}
            <DataTable
            data={data?.pagination_result.results || []}
            columns={roleColumns({})}
            />
        </div>
    )
}