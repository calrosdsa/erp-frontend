import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"

export default function WareHousesClient(){
    const {paginationResult} = useLoaderData<typeof loader>()
    return (
        <div>
            {JSON.stringify(paginationResult)}
            WAREHOUSES
        </div>
    )
}