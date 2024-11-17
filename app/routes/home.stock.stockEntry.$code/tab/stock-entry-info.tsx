import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "../route";

export default function JournalEntryInfo(){
    const {t} = useTranslation("common")
    const {stockEntry} = useLoaderData<typeof loader>()
    return (
        <div className="info-grid">
            <DisplayTextValue
            title={t("form.name")}
            value={stockEntry?.code}
            />
        </div>
    )
}