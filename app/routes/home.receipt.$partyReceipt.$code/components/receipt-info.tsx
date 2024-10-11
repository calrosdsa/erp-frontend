import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import Typography, { subtitle } from "@/components/typography/Typography"
import { useTranslation } from "react-i18next"
import { components } from "~/sdk"
import { formatMediumDate } from "~/util/format/formatDate"


export default function ReceiptInfo({receipt}:{
    receipt?:components["schemas"]["ReceiptDto"]
}){
    const {t,i18n} = useTranslation("common")
    return (
        <div>
             <div className=" info-grid">
                <DisplayTextValue
                title={t("form.code")}
                value={receipt?.code}
                />
                <DisplayTextValue
                title={t("form.party")}
                value={receipt?.party_name}
                />
                
                <DisplayTextValue
                title={t("form.date")}
                value={formatMediumDate(receipt?.posting_date,i18n.language)}
                />
                {/* <DisplayTextValue
                title={t("form.dueDate")}
                value={formatMediumDate(receipt?.due_date,i18n.language)}
                /> */}

                <Typography className=" col-span-full" fontSize={subtitle}>
                {t("form.currencyAndPriceList")}
              </Typography>
                <DisplayTextValue
                title={t("form.currency")}
                value={receipt?.currency}
                />
            </div>
        </div>
    )
}