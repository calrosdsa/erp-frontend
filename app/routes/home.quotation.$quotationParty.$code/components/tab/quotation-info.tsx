import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import Typography, { subtitle } from "@/components/typography/Typography";
import {
  Await,
  useLoaderData,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatMediumDate } from "~/util/format/formatDate";
import { loader } from "../../route";
import { ItemLineType, State, stateToJSON } from "~/gen/common";
import { GlobalState } from "~/types/app";
import LineItems from "@/components/custom/shared/item/line-items";
import TaxAndCharges from "@/components/custom/shared/accounting/tax/tax-and-charges";
import { useTotal } from "~/util/hooks/data/useTotal";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import LineItemsDisplay from "@/components/custom/shared/item/line-items-display";
import { Separator } from "@/components/ui/separator";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import { TaxBreakup } from "@/components/custom/shared/accounting/tax/tax-breakup";

export default function QuotationInfoTab() {
  const { t, i18n } = useTranslation("common");
  const { quotation, lineItems, taxLines } = useLoaderData<typeof loader>();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const params = useParams();
  return (
    <div>
      <div className=" info-grid">
        <DisplayTextValue title={t("form.code")} value={quotation?.code} />
        <DisplayTextValue
          title={t("form.party")}
          value={quotation?.party_name}
        />
        <DisplayTextValue
          title={t("form.postingDate")}
          value={formatMediumDate(quotation?.posting_date, i18n.language)}
        />
        {/* <DisplayTextValue
                title={t("form.dueDate")}
                value={formatMediumDate(quotation?.due_date,i18n.language)}
                /> */}

        <Typography className=" col-span-full" fontSize={subtitle}>
          {t("form.currencyAndPriceList")}
        </Typography>
        <DisplayTextValue
          title={t("form.currency")}
          value={quotation?.currency}
        />

        <LineItemsDisplay
          currency={quotation?.currency || companyDefaults?.currency || ""}
          status={quotation?.status || ""}
          lineItems={lineItems}
          partyType={params.partyReceipt || ""}
          itemLineType={ItemLineType.QUOTATION_LINE_ITEM}
        />
        {quotation && (
          <>
          <TaxAndCharges
            currency={quotation.currency}
            status={quotation.status}
            taxLines={taxLines}
            docPartyID={quotation.id}
          />

        <GrandTotal
        currency={quotation.currency}
        />

        <TaxBreakup
        currency={quotation.currency}
        />
        </>
      )}
      </div>
    </div>
  );
}
