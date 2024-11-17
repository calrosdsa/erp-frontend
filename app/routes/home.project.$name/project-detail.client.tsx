import { useLoaderData, useSearchParams } from "@remix-run/react"
import { loader } from "./route"
import DetailLayout from "@/components/layout/detail-layout"
import { useTranslation } from "react-i18next"
import { routes } from "~/util/route"
import { NavItem } from "~/types"
import ProjectInfo from "./tab/project-info"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"


export default function ProjectDetailClient(){
    const {project} = useLoaderData<typeof loader>()
    const {t}= useTranslation("common")
    const r= routes
    const [searchParams] = useSearchParams()
    const tab = searchParams.get("tab") || "info"
    const toRoute = (tab:string)=>{
        return r.toRoute({
            main:r.project,
            routeSufix:[project?.name || ""],
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
        partyID={project?.id}
        navItems={navItems}
        >
            {tab == "info" && 
            <ProjectInfo/>
            }
        </DetailLayout>
    )
}