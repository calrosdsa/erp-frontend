import { useFetcher } from "@remix-run/react"
import { useEffect } from "react"
import { action } from "~/routes/api.core/route"
import { components, operations } from "~/sdk"
import { Entity } from "~/types/enums"
import { route } from "~/util/route"

export default function ItemConnections(){
    const fetcher = useFetcher<typeof action>()

    const initData =async()=>{
        const connectionParameters:operations["connections"]["parameters"] = {
            path: {
                id: Entity.ITEM.toString()
            }
        }
        fetcher.submit({
            action:"connections",
            connectionParameters:connectionParameters as any,
        },{
            action:route.apiCore,
            method:"POST",
            encType:"application/json",

        })
    }

    useEffect(()=>{
        initData()
    },[])

    return(
        <>
        asda
        {JSON.stringify(fetcher.data?.connections)}
        </>
    )
}