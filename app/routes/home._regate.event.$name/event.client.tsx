import { useLoaderData, useSearchParams } from "@remix-run/react"
import { loader } from "./route"
import { useTranslation } from "react-i18next"
import DetailLayout from "@/components/layout/detail-layout"
import EventInfoTab from "./tab/event-info"
import { useEffect, useState } from "react"
import { NavItem } from "~/types"
import { routes } from "~/util/route"
import EventConnectionsTab from "./tab/event-connections"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"

export default function EventDetailClient(){
    const [searchParams] = useSearchParams()
    const tab = searchParams.get("tab")
    const {event,actions,activities} = useLoaderData<typeof loader>()
    const {t} = useTranslation("common")
    const r = routes
    const [navItems,setNavItems] = useState<NavItem[]>([])
    const setUpNavItems = () =>{
        if(event){
            let tabs:NavItem[] = [
                {title:t("info"),href:r.toEventDetail(event.name,event.uuid)},
                {title:t("connections"),href:r.toEventDetail(event.name,event.uuid,"connections")}
            ]
            setNavItems(tabs)
        }
    }

    setUpToolbar(()=>{
        return {}
    },[])

    useEffect(()=>{
        setUpNavItems()
    },[])
    
    return (
        <DetailLayout
        partyID={event?.id}
        activities={activities}
        navItems={navItems}
        >
            {tab == "info" && 
            <EventInfoTab/>
            }
             {tab == "connections" && 
            <EventConnectionsTab/>
            }
        </DetailLayout>
    )
}