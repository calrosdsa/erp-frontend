import { useLoaderData } from "@remix-run/react"
import { loader } from "../route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { aCompanyUserColumns } from "@/components/custom/table/columns/admin/a-company-columns"


export default function ACompanyUsers(){
    const {company,companyUsers} = useLoaderData<typeof loader>()
    return (
        <div>
            <DataTable
            data={companyUsers || []}
            columns={aCompanyUserColumns()}
            />
        </div>
    )
}