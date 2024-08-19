import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { pricelistItemColums } from "@/components/custom/table/columns/selling/stock/priceListItem"


export default function PriceListsClient(){
    const {data} = useLoaderData<typeof loader>()
    
    return (
        <div>
            <DataTable
            columns={pricelistItemColums()}
            data={data?.pagination_result.results || []}
            />
        </div>
    )
}