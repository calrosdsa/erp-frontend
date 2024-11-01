import { useLoaderData, useParams, useSearchParams } from "@remix-run/react"
import { loader } from "./route"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { formatLongDate } from "~/util/format/formatDate"
import { TreeDescendents } from "@/components/layout/tree/TreeDescendents"
import { TreeGroupLayout } from "@/components/layout/tree/TreeLayout"
import DetailLayout from "@/components/layout/detail-layout"
import GroupInfoTab from "./tab/group.info"
import { routes } from "~/util/route"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"



export default function GroupClient(){
    const {group,actions,groupDescendents,activities} = useLoaderData<typeof loader>()
    const {t,i18n} = useTranslation("common")
    const [searchParams] = useSearchParams()
    const r = routes
    const params =  useParams()
    const groupParty = params.party || ""

    const tab = searchParams.get("tab")
    const navs = [
        {
            title: t("info"),
            href: r.toRoute({
              main: groupParty,
              routePrefix:[r.group],
              routeSufix: [group?.name || ""],
              q: {
                tab: "info",
                id:group?.uuid
              },
            })
          },
    ]
    setUpToolbar(()=>{
        return {}
    },[])
    return (
       <DetailLayout
       navItems={navs}
       activities={activities}
       partyID={group?.id}
       >
        {tab == "info" && 
        <GroupInfoTab/>
        }
       </DetailLayout>
    )
}