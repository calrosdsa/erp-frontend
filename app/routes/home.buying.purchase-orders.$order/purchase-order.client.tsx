import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { DataTable } from "@/components/custom/table/CustomTable";
import { orderLineColumns } from "@/components/custom/table/columns/order/order-line-column";
import OrderSumary from "@/components/custom/display/order-sumary";
import { DEFAULT_CURRENCY } from "~/constant";
import { sumTotal } from "~/util/format/formatCurrency";

export default function PurchaseOrderClient() {
  const { order, actions } = useLoaderData<typeof loader>();
  const { t,i18n} = useTranslation("common");
  return (
    <div>
      <div className="info-grid">
        <Typography fontSize={subtitle} className=" col-span-full">
          {t("info")}
        </Typography>
        <DisplayTextValue title={t("form.name")} value={order?.name} />
        <DisplayTextValue
          title={t("table.createdAt")}
          value={order?.created_at}
        />
        <DisplayTextValue
          title={t("form.deliveryDate")}
          value={order?.delivery_date}
        />

        <div className=" col-span-full">
          <Typography fontSize={subtitle}>{t("_order.orderItems")}</Typography>
          <DataTable
            data={order?.order_lines || []}
            columns={orderLineColumns({ currency: order?.currency || "USD" })}
          />
          {(order && order?.order_lines.length > 0) &&
          <OrderSumary
          orderTotal={sumTotal(order?.order_lines.map(t=>t.amount))}
          taxRate={0.10}
          i18n={i18n}
          currency={order?.currency || DEFAULT_CURRENCY}
          />
        }
        </div>
      </div>
    </div>
  );
}
