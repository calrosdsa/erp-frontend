import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { companyColumns } from "../home.companies_/components/table/columns"
import { aCompanyColumns } from "@/components/custom/table/columns/admin/a-company-columns"


export default function ACompanyClient(){
    const {paginationResult} = useLoaderData<typeof loader>()
    return (
        <div>
            <DataTable
            data={paginationResult?.results || []}
            columns={aCompanyColumns()}
            paginationOptions={{
                rowCount:paginationResult?.total
            }}
            />
        </div>
    )
}