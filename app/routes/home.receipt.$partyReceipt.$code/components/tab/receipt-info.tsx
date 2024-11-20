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
import { DataTable } from "@/components/custom/table/CustomTable";
import { displayItemLineColumns, lineItemColumns } from "@/components/custom/table/columns/order/order-line-column";
import { DEFAULT_CURRENCY } from "~/constant";
import { sumTotal } from "~/util/format/formatCurrency";
import OrderSumary from "@/components/custom/display/order-sumary";
import { useItemLine } from "@/components/custom/shared/item/item-line";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import { ItemLineType, State, stateToJSON } from "~/gen/common";
import { GlobalState } from "~/types/app";
import { Suspense } from "react";
import FallBack from "@/components/layout/Fallback";
import LineItems from "@/components/custom/shared/item/line-items";

export default function ReceiptInfoTab() {
  const { t, i18n } = useTranslation("common");
  const { receipt, lineItems } = useLoaderData<typeof loader>();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const params = useParams();

 
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

        <LineItems
        currency={receipt?.currency || companyDefaults?.currency || ""}
        status={receipt?.status || ""}
        lineItems={lineItems}
        partyType={params.partyReceipt || ""}
        itemLineType={ItemLineType.ITEM_LINE_RECEIPT}
        />
      </div>
    </div>
  );
}
