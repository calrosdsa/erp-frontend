import { useLoaderData, useSearchParams } from "@remix-run/react"
import { loader } from "./route"
import DetailLayout from "@/components/layout/detail-layout"
import { useTranslation } from "react-i18next"
import { routes } from "~/util/route"
import { NavItem } from "~/types"
import ProjectInfo from "./tab/serial-no-info"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"
import { stateFromJSON } from "~/gen/common"


export default function SerialNoClientDetail(){
    const {serialNo} = useLoaderData<typeof loader>()
    const {t}= useTranslation("common")
    const r= routes
    const [searchParams] = useSearchParams()
    const tab = searchParams.get("tab") || "info"
    const toRoute = (tab:string)=>{
        return r.toRoute({
            main:r.serialNo,
            routeSufix:[serialNo?.serial_no || ""],
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
            status:stateFromJSON(serialNo?.status),
        }
    },[])
    return(
        <DetailLayout
        partyID={serialNo?.id}
        navItems={navItems}
        >
            {tab == "info" && 
            <ProjectInfo/>
            }
        </DetailLayout>
    )
}