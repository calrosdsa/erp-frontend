import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "../route";

export default function ProjectInfo(){
    const {t} = useTranslation("common")
    const {serialNo} = useLoaderData<typeof loader>()
    return (
        <div className="info-grid">
            <DisplayTextValue
            title={t("serialNo")}
            value={serialNo?.serial_no}
            />
        </div>
    )
}