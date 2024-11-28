import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { GlobalState, OrderGlobalState } from "~/types/app";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatMediumDate } from "~/util/format/formatDate";
import { ItemLineType, State, stateFromJSON, stateToJSON } from "~/gen/common";
import { loader } from "../../route";
import LineItems from "@/components/custom/shared/item/line-items";
import LineItemsDisplay from "@/components/custom/shared/item/line-items-display";
import { TaxBreakup } from "@/components/custom/shared/accounting/tax/tax-breakup";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import TaxAndCharges from "@/components/custom/shared/accounting/tax/tax-and-charges";

export default function OrderInfoTab() {
  const { order, lineItems, taxLines } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const params = useParams();
  const { companyDefaults } = useOutletContext<GlobalState>();

  return (
    <div className="info-grid">
      <DisplayTextValue title={t("_supplier.base")} value={order?.party_name} />
      <DisplayTextValue title={t("form.code")} value={order?.code} />
      <DisplayTextValue
        title={t("form.postingDate")}
        value={formatMediumDate(order?.posting_date, i18n.language)}
      />
      <DisplayTextValue
        title={t("form.deliveryDate")}
        value={formatMediumDate(order?.delivery_date, i18n.language)}
      />

      <LineItemsDisplay
        currency={order?.currency || companyDefaults?.currency || ""}
        status={order?.status || ""}
        lineItems={lineItems}
        partyType={params.partyReceipt || ""}
        itemLineType={ItemLineType.QUOTATION_LINE_ITEM}
      />
      {order && (
        <>
          <TaxAndCharges
            currency={order.currency}
            status={order.status}
            taxLines={taxLines}
            docPartyID={order.id}
          />

          <GrandTotal currency={order.currency} />

          <TaxBreakup currency={order.currency} />
        </>
      )}
    </div>
  );
}
