import { components } from "~/sdk"
import DisplayTextValue from "../../display/DisplayTextValue"
import { useTranslation } from "react-i18next"
import Typography, { subtitle } from "@/components/typography/Typography"
import { DataTable } from "../../table/CustomTable"
import { displayItemLineColumns } from "../../table/columns/order/order-line-column"
import { sumTotal } from "~/util/format/formatCurrency"
import OrderSumary from "../../display/order-sumary"
import { DEFAULT_CURRENCY } from "~/constant"
import { formatMediumDate } from "~/util/format/formatDate"


export default function InvoiceTemplate({invoiceDetail}:{
    invoiceDetail?:components["schemas"]["InvoiceDetailDto"]
}){
    const {t,i18n} = useTranslation("common")
    const invoice = invoiceDetail?.invoice
    
    return (
        <div>
            <div className=" info-grid">
                <DisplayTextValue
                title={t("form.code")}
                value={invoice?.code}
                />
                <DisplayTextValue
                title={t("form.party")}
                value={invoice?.party_name}
                />
                
                <DisplayTextValue
                title={t("form.date")}
                value={formatMediumDate(invoice?.date,i18n.language)}
                />
                <DisplayTextValue
                title={t("form.dueDate")}
                value={formatMediumDate(invoice?.due_date,i18n.language)}
                />
                <DisplayTextValue
                title={t("form.currency")}
                value={invoice?.currency}
                />
            </div>

            <div className=" col-span-full pt-3">

          <Typography fontSize={subtitle}>{t("items")}</Typography>
          <DataTable
            data={invoiceDetail?.item_lines || []}
            columns={displayItemLineColumns({ currency: invoice?.currency || DEFAULT_CURRENCY })}
            />


       {(invoiceDetail && invoiceDetail?.item_lines.length > 0) &&
          <OrderSumary
          orderTotal={sumTotal(invoiceDetail?.item_lines.map(t=>t.rate * t.quantity))}
          orderTax={0}
          i18n={i18n}
          currency={invoice?.currency || DEFAULT_CURRENCY}
          />
        }

            </div>
        </div>
    )
}