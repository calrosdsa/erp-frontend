import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import ItemAttributeInfo from "./components/item-attribute-info"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { makeZodI18nMap } from "zod-i18n-map"


export default function ItemAttributeClient(){
    const {error,itemAttribute} = useLoaderData<typeof loader>()
    

    return (
        <div>
            <ItemAttributeInfo/>
        </div>
    )
}