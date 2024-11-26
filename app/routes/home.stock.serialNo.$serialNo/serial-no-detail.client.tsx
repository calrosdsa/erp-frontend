import { useLoaderData, useNavigate, useOutletContext, useSearchParams } from "@remix-run/react"
import { loader } from "./route"
import DetailLayout from "@/components/layout/detail-layout"
import { useTranslation } from "react-i18next"
import { routes } from "~/util/route"
import { NavItem } from "~/types"
import SerialNoInfo from "./tab/serial-no-info"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"
import { stateFromJSON } from "~/gen/common"
import { usePermission } from "~/util/hooks/useActions"
import { GlobalState } from "~/types/app"
import { format } from "date-fns"
import { ButtonToolbar } from "~/types/actions"


export default function SerialNoClientDetail(){
    const {serialNo,actions} = useLoaderData<typeof loader>()
    const {t}= useTranslation("common")
    const r= routes
    const [searchParams] = useSearchParams()
    const tab = searchParams.get("tab") || "info"
    const {roleActions} = useOutletContext<GlobalState>()
    const [permission] = usePermission({
        roleActions:roleActions,
        actions:actions
    })
    const navigate = useNavigate()
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
        let buttons:ButtonToolbar[] = []
        if(permission?.view){
            buttons.push({
                label:t("form.sumary"),
                onClick:()=>{
                    navigate(r.toRoute({
                        main:r.serialNoResume,
                        routePrefix:[r.stockM],
                        q:{
                            serialNo:serialNo?.serial_no || "",
                            fromDate:format(new Date(serialNo?.created_at || ""),"yyyy-MM-dd")
                            
                        }
                    }))
                }
            })
        }
        return {
            status:stateFromJSON(serialNo?.status),
            buttons:buttons
        }
    },[permission])
    return(
        <DetailLayout
        partyID={serialNo?.id}
        navItems={navItems}
        >
            {tab == "info" && 
            <SerialNoInfo/>
            }
        </DetailLayout>
    )
}