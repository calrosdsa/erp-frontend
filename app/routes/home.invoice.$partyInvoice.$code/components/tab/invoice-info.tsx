import { components } from "~/sdk";
import { useTranslation } from "react-i18next";
import { formatCurrency, sumTotal } from "~/util/format/formatCurrency";
import { DEFAULT_CURRENCY } from "~/constant";
import { formatMediumDate } from "~/util/format/formatDate";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { loader } from "../../route";
import { ItemLineType, State, stateToJSON } from "~/gen/common";
import { Typography } from "@/components/typography";
import { GlobalState } from "~/types/app";
import LineItems from "@/components/custom/shared/item/line-items";
import LineItemsDisplay from "@/components/custom/shared/item/line-items-display";
import TaxAndCharges from "@/components/custom/shared/accounting/tax/tax-and-charges";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import { TaxBreakup } from "@/components/custom/shared/accounting/tax/tax-breakup";

export default function InvoiceInfoTab() {
  const { t, i18n } = useTranslation("common");
  const { invoice, lineItems, totals,taxLines } = useLoaderData<typeof loader>();
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

<LineItemsDisplay
        currency={invoice?.currency || companyDefaults?.currency || ""}
        status={invoice?.status || ""}
        lineItems={lineItems}
        partyType={params.partyReceipt || ""}
        itemLineType={ItemLineType.QUOTATION_LINE_ITEM}
      />
      {invoice && (
        <>
          <TaxAndCharges
            currency={invoice.currency}
            status={invoice.status}
            taxLines={taxLines}
            docPartyID={invoice.id}
          />

          <GrandTotal currency={invoice.currency} />

          <TaxBreakup currency={invoice.currency} />
        </>
      )}

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
