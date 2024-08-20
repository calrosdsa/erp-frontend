import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import ItemAttributeInfo from "./components/item-attribute-info"


export default function ItemAttributeClient(){
    const {error,itemAttribute} = useLoaderData<typeof loader>()
    return (
        <div>
            <ItemAttributeInfo/>
        </div>
    )
}