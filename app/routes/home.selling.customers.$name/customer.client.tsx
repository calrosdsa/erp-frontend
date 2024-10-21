import { useLoaderData, useNavigate } from "@remix-run/react"
import { loader } from "./route"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { formatLongDate } from "~/util/format/formatDate"
import { routes } from "~/util/route"
import { PartyAddresses } from "../home.party/components/party-addresses"
import { PartyType } from "~/gen/common"


export default function CustomerClient(){
    const {customer,actions} = useLoaderData<typeof loader>()
    const { t,i18n } = useTranslation("common")
    const navigate = useNavigate()
    const r = routes

    return (
        <div>
            <div className="info-grid">
                <Typography className="col-span-full" fontSize={subtitle}>
                    {t("_customer.info")}
                </Typography>

                <DisplayTextValue
                value={customer?.name}
                title={t("form.name")}
                />
                <DisplayTextValue
                value={customer?.customer_type}
                title={t("form.type")}
                />
                <DisplayTextValue
                value={formatLongDate(customer?.created_at,i18n.language)}
                title={t("table.createdAt")}
                />
                <DisplayTextValue
                value={customer?.group_name}
                title={t("_group.base")}
                to={r.toGroupsByParty(PartyType.customerGroup)}
                />


            </div>

            <div >

                {/* <PartyAddresses/> */}
                
            </div>
        </div>
    )
}