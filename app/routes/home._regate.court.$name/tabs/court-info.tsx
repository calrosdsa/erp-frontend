import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { loader } from "../route"


export default function CourtInfoTab(){
    const {t}  = useTranslation("common")
    const  {court} = useLoaderData<typeof loader>()
    return(
        <div className=" info-grid">
            <DisplayTextValue
            title={t("form.name")}
            value={court?.name}
            />        
            <DisplayTextValue
            title={t("form.enabled")}
            value={court?.enabled}
            />        
        </div>
    )
}