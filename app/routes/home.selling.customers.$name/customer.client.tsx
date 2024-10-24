import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react"
import { loader } from "./route"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { formatLongDate } from "~/util/format/formatDate"
import { routes } from "~/util/route"
import { PartyAddresses } from "../home.party/components/party-addresses"
import { PartyType } from "~/gen/common"
import DetailLayout from "@/components/layout/detail-layout"
import CustomerInfo from "./components/tab/customer-info"


export default function CustomerClient(){
    const {customer,actions,activities} = useLoaderData<typeof loader>()
    const [searchParams] = useSearchParams()
    const tab = searchParams.get("tab")
    const { t,i18n } = useTranslation("common")
    const r = routes
    const navItems = [
        {
            title: t("info"),
            href: r.toCustomerDetail(customer?.name || "",customer?.uuid || ""),
          },
    ]

    return (
        <DetailLayout
        activities={activities}
        partyID={customer?.id}
        navItems={navItems}
        >
            {tab == "info" &&
            <CustomerInfo/>
            }
        </DetailLayout>
    )
}