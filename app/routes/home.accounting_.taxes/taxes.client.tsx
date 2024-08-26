import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { taxColumns } from "@/components/custom/table/columns/accounting/tax-columns"


export default function TaxesClient(){
    const {result} = useLoaderData<typeof loader>()
    return (
        <div>
            <DataTable
            columns={taxColumns()}
            data={result?.results || []}
            />
        </div>
    )
}