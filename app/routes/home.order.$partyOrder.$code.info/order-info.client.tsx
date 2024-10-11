import { useOutletContext, useParams } from "@remix-run/react";
import { OrderGlobalState } from "~/types/app";
import { OrderInfo } from "./components/order-info";
import { useTranslation } from "react-i18next";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import Typography, { subtitle } from "@/components/typography/Typography";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatMediumDate } from "~/util/format/formatDate";
import { DataTable } from "@/components/custom/table/CustomTable";
import { displayItemLineColumns } from "@/components/custom/table/columns/order/order-line-column";
import OrderSumary from "@/components/custom/display/order-sumary";
import { sumTotal } from "~/util/format/formatCurrency";
import { DEFAULT_CURRENCY } from "~/constant";
import { useItemLine } from "@/components/custom/shared/item/item-line";
import { State, stateToJSON } from "~/gen/common";

export default function OrderInfoClient() {
  const orderState = useOutletContext<OrderGlobalState>();
  const { order } = orderState;
  const { t, i18n } = useTranslation("common");
  const itemLine = useItemLine();
  const params = useParams();
  const [metaOptions] = useTableRowActions({
    onEdit: (rowIndex) => {
      const line = order?.order_lines[rowIndex];
      console.log("ITEM LINE EDIT", line);
      itemLine.onOpenDialog({
        title: t("f.editRow", { o: `#${rowIndex}` }),
        allowEdit: order?.status == stateToJSON(State.DRAFT),
        line: line,
        currency: order?.currency,
        partyType: params.partyOrder || "",
      });
    },
  });
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

        <div className=" col-span-full">
          <Typography fontSize={subtitle}>{t("_order.orderItems")}</Typography>
          <DataTable
            data={order?.order_lines || []}
            columns={displayItemLineColumns({
              currency: order?.currency || "USD",
            })}
            metaOptions={{
              meta: {
                ...metaOptions,
              },
            }}
          />
          {order && order?.order_lines.length > 0 && (
            <OrderSumary
              orderTotal={sumTotal(
                order?.order_lines.map((t) => t.rate * t.quantity)
              )}
              orderTax={0}
              i18n={i18n}
              currency={order?.currency || DEFAULT_CURRENCY}
            />
          )}
        </div>
      </div>
    </div>
  );
}
