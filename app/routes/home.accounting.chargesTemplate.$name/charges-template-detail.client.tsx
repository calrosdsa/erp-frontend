import { useLoaderData, useSearchParams } from "@remix-run/react"
import { loader } from "./route"
import DetailLayout from "@/components/layout/detail-layout"
import { useTranslation } from "react-i18next"
import { route } from "~/util/route"
import { NavItem } from "~/types"
import CostCenterInfo from "./tab/charges-template-info"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"


export default function ChargesTemplateDetailClient(){
    const {chargesTemplate} = useLoaderData<typeof loader>()
    const {t}= useTranslation("common")
    const r= route
    const [searchParams] = useSearchParams()
    const tab = searchParams.get("tab") || "info"
    const toRoute = (tab:string)=>{
        return r.toRoute({
            main:r.chargesTemplate,
            routePrefix:[r.accountingM],
            routeSufix:[chargesTemplate?.name || ""],
            q:{
                tab:tab,
                id:chargesTemplate?.uuid || ""
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
        partyID={chargesTemplate?.id}
        navItems={navItems}
        >
            {tab == "info" && 
            <CostCenterInfo/>
            }
        </DetailLayout>
    )
}