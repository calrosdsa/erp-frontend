import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useOutletContext } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { WarehouseGlobalState } from "~/types/app"
import { formatLongDate } from "~/util/format/formatDate"


export default function WareHouseInfoClient(){
    const {warehouse} = useOutletContext<WarehouseGlobalState>()
    const {t,i18n} = useTranslation("common")
    return (
        <div>
           <div className="info-grid-sidebar">

        <DisplayTextValue title={t("form.name")} value={warehouse?.name} />

        <DisplayTextValue title={t("form.enabled")} value={warehouse?.enabled} />

        <DisplayTextValue title={t("table.createdAt")} value={formatLongDate(warehouse?.created_at,i18n.language)} />

      </div>
        </div>
    )
}