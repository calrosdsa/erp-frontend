import { components } from "~/sdk";
import { useTranslation } from "react-i18next";
import { formatCurrency, sumTotal } from "~/util/format/formatCurrency";
import { DEFAULT_CURRENCY } from "~/constant";
import { formatMediumDate } from "~/util/format/formatDate";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { DataTable } from "@/components/custom/table/CustomTable";
import OrderSumary from "@/components/custom/display/order-sumary";
import { useItemLine } from "@/components/custom/shared/item/item-line";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { loader } from "../../route";
import { ItemLineType, State, stateToJSON } from "~/gen/common";
import { displayItemLineColumns } from "@/components/custom/table/columns/order/order-line-column";
import { Typography } from "@/components/typography";
import { GlobalState } from "~/types/app";
import LineItems from "@/components/custom/shared/item/line-items";

export default function InvoiceInfoTab() {
  const { t, i18n } = useTranslation("common");
  const { invoice, lineItems, totals } = useLoaderData<typeof loader>();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const params = useParams();

  return (
    <div>
      <div className=" info-grid">
        <DisplayTextValue title={t("form.code")} value={invoice?.code} />
        <DisplayTextValue title={t("form.party")} value={invoice?.party_name} />

        <DisplayTextValue
          title={t("form.date")}
          value={formatMediumDate(invoice?.date, i18n.language)}
        />
        <DisplayTextValue
          title={t("form.dueDate")}
          value={formatMediumDate(invoice?.due_date, i18n.language)}
        />
        <DisplayTextValue
          title={t("form.currency")}
          value={invoice?.currency}
        />

        <LineItems
          currency={invoice?.currency || companyDefaults?.currency || ""}
          status={invoice?.status || ""}
          lineItems={lineItems}
          partyType={params.partyOrder || ""}
          itemLineType={ItemLineType.ITEM_LINE_INVOICE}
        />

        {totals && (
          <>
            <Typography variant="title1" className=" col-span-full">
              {t("form.totals")}
            </Typography>

            <DisplayTextValue
              title={t("form.total")}
              value={formatCurrency(
                totals.total,
                invoice?.currency,
                i18n.language
              )}
            />
            <DisplayTextValue
              title={t("form.paidAmount")}
              value={formatCurrency(
                totals.paid,
                invoice?.currency,
                i18n.language
              )}
            />
            <DisplayTextValue
              title={t("form.outstandingAmount")}
              value={formatCurrency(
                totals.total - totals.paid,
                invoice?.currency,
                i18n.language
              )}
            />
          </>
        )}
      </div>
    </div>
  );
}
