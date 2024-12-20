import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { entityColumns } from "@/components/custom/table/columns/admin/entity-columns"


export default function EntityClient(){
    const { paginationResult} = useLoaderData<typeof loader>()
    return (
        <div>
            <DataTable
            data={paginationResult?.results || []}
            columns={entityColumns()}
            paginationOptions={{
                rowCount:paginationResult?.total,
            }}
            enableSizeSelection={true}
            />
        </div>
    )
}

