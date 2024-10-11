import Typography, { subtitle } from "@/components/typography/Typography";
import { useFetcher, useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { GlobalState } from "~/types/app";
import { routes } from "~/util/route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { components } from "~/sdk";
import { formatMediumDate } from "~/util/format/formatDate";
import { DataTable } from "@/components/custom/table/CustomTable";
import { DEFAULT_CURRENCY } from "~/constant";
import OrderSumary from "@/components/custom/display/order-sumary";
import { displayItemLineColumns } from "@/components/custom/table/columns/order/order-line-column";
import { sumTotal } from "~/util/format/formatCurrency";
import useTableRowActions from "~/util/hooks/useTableRowActions";


export const OrderInfo = ({order}:{
    order?:components["schemas"]["OrderDto"]
})=>{
 
    const { t, i18n } = useTranslation("common");
    const [metaOptions] = useTableRowActions({
      onEdit:(rowIndex)=>{

      }
    })
    return (
        <div>
        <div className="info-grid">
          <Typography fontSize={subtitle} className=" col-span-full">
            {t("info")}
          </Typography>
  
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
                meta:{
                  ...metaOptions,
                }
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
    )
}