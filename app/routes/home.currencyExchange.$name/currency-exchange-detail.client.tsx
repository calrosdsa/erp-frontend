import { useLoaderData, useSearchParams } from "@remix-run/react"
import { loader } from "./route"
import DetailLayout from "@/components/layout/detail-layout"
import { useTranslation } from "react-i18next"
import { routes } from "~/util/route"
import { NavItem } from "~/types"
import CostCenterInfo from "./tab/currency-exchange-info"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"
import { stateFromJSON } from "~/gen/common"


export default function CurrencyExchangeDetailClient(){
    const {currencyExchange} = useLoaderData<typeof loader>()
    const {t}= useTranslation("common")
    const r= routes
    const [searchParams] = useSearchParams()
    const tab = searchParams.get("tab") || "info"
    const toRoute = (tab:string)=>{
        return r.toRoute({
            main:r.currencyExchange,
            routePrefix:[r.accountingM],
            routeSufix:[currencyExchange?.name || ""],
            q:{
                tab:tab,
                id:currencyExchange?.uuid || ""
            }
        })
    }

    const navItems:NavItem[] = [
        {
            title:t("info"),
            href:toRoute("info")
        }
    ]

    setUpToolbar(()=>{
        return {
            status:stateFromJSON(currencyExchange?.status),
        }
    },[currencyExchange])
    return(
        <DetailLayout
        partyID={currencyExchange?.id}
        navItems={navItems}
        >
            {tab == "info" && 
            <CostCenterInfo/>
            }
        </DetailLayout>
    )
}