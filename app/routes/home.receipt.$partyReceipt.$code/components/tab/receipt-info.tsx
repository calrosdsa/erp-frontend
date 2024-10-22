import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatMediumDate } from "~/util/format/formatDate";
import { loader } from "../../route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { displayItemLineColumns } from "@/components/custom/table/columns/order/order-line-column";
import { DEFAULT_CURRENCY } from "~/constant";
import { sumTotal } from "~/util/format/formatCurrency";
import OrderSumary from "@/components/custom/display/order-sumary";

export default function ReceiptInfoTab() {
  const { t, i18n } = useTranslation("common");
  const {receipt,itemLines} = useLoaderData<typeof loader>()
  return (
    <div>
      <div className=" info-grid">
        <DisplayTextValue title={t("form.code")} value={receipt?.code} />
        <DisplayTextValue title={t("form.party")} value={receipt?.party_name} />
        <DisplayTextValue
          title={t("form.date")}
          value={formatMediumDate(receipt?.posting_date, i18n.language)}
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

<div className=" col-span-full pt-3">
        <Typography fontSize={subtitle}>{t("items")}</Typography>
        <DataTable
          data={itemLines || []}
          columns={displayItemLineColumns({
            currency: receipt?.currency || DEFAULT_CURRENCY,
          })}
        />

        {receipt && itemLines.length > 0 && (
          <OrderSumary
            orderTotal={sumTotal(
              itemLines.map((t) => t.rate * t.quantity)
            )}
            orderTax={100}
            i18n={i18n}
            currency={receipt?.currency || DEFAULT_CURRENCY}
          />
        )}
      </div>
      </div>

      
    </div>
  );
}
