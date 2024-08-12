import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable";
import { itemGroupColumns } from "./components/table/columns";


export default function ItemGroupsClient(){
    const {paginationResult} = useLoaderData<typeof loader>()
    return(
        <>
        <DataTable
        columns={itemGroupColumns}
        data={paginationResult?.pagination_result.results || []}
        />
        </>
    )
}