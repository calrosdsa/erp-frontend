import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { routes } from "~/util/route"
import { useTranslation } from "react-i18next"

export default function AccountLedgerDetailClient(){
    const {actions,accountDetail} = useLoaderData<typeof loader>()
    const r = routes
    const {t} = useTranslation("common")
    return (
        <div>
           <div className=" info-grid">
            <DisplayTextValue
            title={t("form.name")}
            value={accountDetail?.name}
            />
           </div>
        </div>
    )
}