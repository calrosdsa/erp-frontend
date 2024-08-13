import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { columns } from "./components/table/columns"
import { useTranslation } from "react-i18next"


export default function CustomerOrders(){
    const {data} = useLoaderData<typeof loader>()
    return(
        <div>
         <DataTable
         columns={columns()}
         data={data?.pagination_result?.results || []}

         />
        </div>
    )
}