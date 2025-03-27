import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "../route";

export default function BatchBundleInfo(){
    const {t} = useTranslation("common")
    const {batchBundle} = useLoaderData<typeof loader>()
    return (
        <div className="detail-grid">
            <DisplayTextValue
            title={t("item")}
            value={batchBundle?.item}
            />
            <DisplayTextValue
            title={t("warehouse")}
            value={batchBundle?.warehouse}
            />
        </div>
    )
}