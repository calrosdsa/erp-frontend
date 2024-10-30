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
import { useLoaderData, useParams } from "@remix-run/react";
import { loader } from "../../route";
import { ItemLineType, State, stateToJSON } from "~/gen/common";
import { displayItemLineColumns } from "@/components/custom/table/columns/order/order-line-column";
import { Typography } from "@/components/typography";

export default function InvoiceInfoTab() {
  const { t, i18n } = useTranslation("common");
  const { invoice,itemLines,totals } = useLoaderData<typeof loader>();
  const itemLine = useItemLine();
  const params = useParams()
  const [metaOptions] = useTableRowActions({
    onEdit: (rowIndex) => {
        if(itemLines && itemLines.length >0){
            const line = itemLines[rowIndex];
            itemLine.onOpenDialog({
                title: t("f.editRow", { o: `#${rowIndex}` }),
                allowEdit: invoice?.status == stateToJSON(State.DRAFT),
                line: line,
                currency: invoice?.currency,
                partyType: params.partyInvoice || "",
                itemLineType: ItemLineType.ITEM_LINE_INVOICE,
            });
        }
    },
  });
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

      <div className=" col-span-full pt-3">
        <Typography variant="title1">{t("items")}</Typography>
        <DataTable
          data={itemLines || []}
          columns={displayItemLineColumns({
            currency: invoice?.currency || DEFAULT_CURRENCY,
          })}
          metaOptions={{
            meta:metaOptions
          }}
        />

      </div>
       {totals && (
        <>
       <Typography variant="title1" className=" col-span-full">{t("form.totals")}</Typography>

       <DisplayTextValue
       title={t("form.total")}
       value={formatCurrency(totals.total,invoice?.currency,i18n.language)}
       />
       <DisplayTextValue
       title={t("form.paidAmount")}
       value={formatCurrency(totals.paid,invoice?.currency,i18n.language)}
       />
       <DisplayTextValue
       title={t("form.outstandingAmount")}
       value={formatCurrency(totals.total-totals.paid,invoice?.currency,i18n.language)}
       />
            </>
        )}

      </div>


    </div>
  );
}
