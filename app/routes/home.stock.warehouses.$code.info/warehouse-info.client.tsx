import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useOutletContext } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { WarehouseGlobalState } from "~/types/app"


export default function WareHouseInfoClient(){
    const {warehouse} = useOutletContext<WarehouseGlobalState>()
    const {t} = useTranslation("common")
    return (
        <div>
           <div className="info-grid-sidebar">

        <DisplayTextValue title={t("form.name")} value={warehouse?.Name} />

        <DisplayTextValue title={t("form.enabled")} value={warehouse?.Enabled} />
      </div>
        </div>
    )
}