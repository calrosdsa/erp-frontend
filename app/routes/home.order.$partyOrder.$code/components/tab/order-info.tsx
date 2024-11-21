import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { GlobalState, OrderGlobalState } from "~/types/app";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatMediumDate } from "~/util/format/formatDate";
import { ItemLineType, State, stateFromJSON, stateToJSON } from "~/gen/common";
import { loader } from "../../route";
import LineItems from "@/components/custom/shared/item/line-items";

export default function OrderInfoTab() {
  const { order,lineItems } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const params = useParams();
  const { companyDefaults } = useOutletContext<GlobalState>();

  return (
    <div>
      <div className="info-grid">
        <DisplayTextValue
          title={t("_supplier.base")}
          value={order?.party_name}
        />
        <DisplayTextValue title={t("form.code")} value={order?.code} />
        <DisplayTextValue
          title={t("form.date")}
          value={formatMediumDate(order?.date, i18n.language)}
        />
        <DisplayTextValue
          title={t("form.deliveryDate")}
          value={formatMediumDate(order?.delivery_date, i18n.language)}
        />

        <LineItems
          currency={order?.currency || companyDefaults?.currency || ""}
          status={order?.status || ""}
          lineItems={lineItems}
          partyType={params.partyOrder || ""}
          itemLineType={ItemLineType.ITEM_LINE_ORDER}
        />
      </div>
    </div>
  );
}
