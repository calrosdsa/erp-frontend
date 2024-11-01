import { useLoaderData, useParams } from "@remix-run/react"
import { loader } from "../route"
import { useTranslation } from "react-i18next"
import { TreeGroupLayout } from "@/components/layout/tree/TreeLayout"
import { Typography } from "@/components/typography"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { formatLongDate } from "~/util/format/formatDate"


export default function GroupInfoTab(){
    const {group,actions,groupDescendents} = useLoaderData<typeof loader>()
    const {t,i18n} = useTranslation("common")
    const params =  useParams()
    const groupParty = params.party || ""
    return (
        <TreeGroupLayout data={groupDescendents || []}
        partyType={groupParty}
        >
            {/* {JSON.stringify(groupDescendents)} */}
            
            <div className="info-grid">
                <DisplayTextValue
                title={t("form.name")}
                value={group?.name}
                />
                <DisplayTextValue
                title={t("form.isGroup")}
                value={group?.is_group}
                />
                {group &&
                  <DisplayTextValue
                  title={t("table.createdAt")}
                  value={formatLongDate(group.created_at,i18n.language)}
                  />
                }
            </div>
            {/* {JSON.stringify(group)} */}
        </TreeGroupLayout>
    )
}