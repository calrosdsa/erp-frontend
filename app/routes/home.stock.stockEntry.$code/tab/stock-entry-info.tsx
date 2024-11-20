import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "../route";
import { GlobalState } from "~/types/app";
import LineItems from "@/components/custom/shared/item/line-items";
import { ItemLineType } from "~/gen/common";
import { formatMediumDate } from "~/util/format/formatDate";

export default function StockEntryInfo() {
  const { stockEntry, lineItems } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const params = useParams();
  const { companyDefaults } = useOutletContext<GlobalState>();
  return (
    <div className="info-grid">
      <DisplayTextValue title={t("form.code")} value={stockEntry?.code} />

      <DisplayTextValue
        title={t("form.entryType")}
        value={stockEntry?.entry_type}
      />

      <DisplayTextValue
        title={t("form.postingDate")}
        value={formatMediumDate(stockEntry?.posting_date,i18n.language)}
      />

      <LineItems
        currency={stockEntry?.currency || companyDefaults?.currency || ""}
        status={stockEntry?.status || ""}
        lineItems={lineItems}
        partyType={params.partyOrder || ""}
        itemLineType={ItemLineType.ITEM_LINE_STOCK_ENTRY}
      />
    </div>
  );
}
