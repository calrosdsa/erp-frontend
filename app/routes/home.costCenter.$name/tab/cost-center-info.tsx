import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "../route";

export default function CostCenterInfo(){
    const {t} = useTranslation("common")
    const {costCenter} = useLoaderData<typeof loader>()
    return (
        <div className="info-grid">
            <DisplayTextValue
            title={t("form.name")}
            value={costCenter?.name}
            />
        </div>
    )
}