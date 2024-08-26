import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"


export default function ItemGroupDetailClient(){
    const {itemGroup} = useLoaderData<typeof loader>()
    const {t} = useTranslation("common")
    return (
        <div>
        <div className=" info-grid">
            <Typography fontSize={subtitle} className=" col-span-full">
                {t("info")}
            </Typography>
            <DisplayTextValue
            title={t("form.name")}
            value={itemGroup?.Name}
            />
            <DisplayTextValue
            title={t("table.createdAt")}
            value={itemGroup?.CreatedAt}
            />
        </div>
        </div>
    )
}