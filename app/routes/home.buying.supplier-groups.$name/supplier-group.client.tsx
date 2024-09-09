import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { formatLongDate } from "~/util/format/formatDate"
import { TreeDescendents } from "@/components/layout/tree/TreeDescendents"
import { TreeGroupLayout } from "@/components/layout/tree/TreeLayout"



export default function SupplierGroupClient(){
    const {group,actions,groupDescendents} = useLoaderData<typeof loader>()
    const {t,i18n} = useTranslation("common")
    return (
        <TreeGroupLayout data={groupDescendents || []}>
            {/* {JSON.stringify(groupDescendents)} */}
            
            <div className="info-grid">
                <Typography fontSize={subtitle} className=" col-span-full">
                    {t("info")}
                </Typography>

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