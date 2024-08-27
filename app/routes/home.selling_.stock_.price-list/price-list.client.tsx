import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { pricelistItemColums } from "@/components/custom/table/columns/selling/stock/priceListItem"
import useCreatePriceList from "./components/add-price-list"


export default function PriceListsClient(){
    const {data} = useLoaderData<typeof loader>()
    const [dialog,setOpen] = useCreatePriceList()
    return (
        <>
        {dialog}
            <DataTable
            columns={pricelistItemColums()}
            data={data?.pagination_result.results || []}
            metaActions={{
                meta:{
                    addNew:()=>{
                        setOpen(true)  
                    }
                }
            }}
            />
        </>
    )
}