import { useLoaderData } from "@remix-run/react"
import { loader } from "../route"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { useTranslation } from "react-i18next"


export default function EventInfoTab(){
    const {event} = useLoaderData<typeof loader>()
    const {t} = useTranslation("common")
    return (
        <div className="info-grid">
            <DisplayTextValue
            title={t("form.name")}
            value={event?.name}
            />
        </div>
    )
}