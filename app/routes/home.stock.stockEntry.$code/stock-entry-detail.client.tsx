import { useLoaderData, useSearchParams } from "@remix-run/react"
import { loader } from "./route"
import DetailLayout from "@/components/layout/detail-layout"
import { useTranslation } from "react-i18next"
import { routes } from "~/util/route"
import { NavItem } from "~/types"
import JournalEntryInfo from "./tab/stock-entry-info"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"


export default function StockEntryDetailClient(){
    const {stockEntry} = useLoaderData<typeof loader>()
    const {t}= useTranslation("common")
    const r= routes
    const [searchParams] = useSearchParams()
    const tab = searchParams.get("tab") || "info"
    const toRoute = (tab:string)=>{
        return r.toRoute({
            main:r.stockEntry,
            routePrefix:[r.stock],
            routeSufix:[stockEntry?.code || ""],
            q:{
                tab:tab
            }
        })
    }
    const navItems:NavItem[] = [
        {
            title:t("form.name"),
            href:toRoute("info")
        }
    ]
    setUpToolbar(()=>{
        return {
        }
    },[])
    return(
        <DetailLayout
        partyID={stockEntry?.id}
        navItems={navItems}
        >
            {tab == "info" && 
            <JournalEntryInfo/>
            }
        </DetailLayout>
    )
}