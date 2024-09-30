import { useLoaderData, useNavigate, useOutletContext, useRevalidator } from "@remix-run/react";
import { loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { DataTable } from "@/components/custom/table/CustomTable";
import { displayItemLineColumns, orderLineColumns } from "@/components/custom/table/columns/order/order-line-column";
import OrderSumary from "@/components/custom/display/order-sumary";
import { DEFAULT_CURRENCY } from "~/constant";
import { sumTotal } from "~/util/format/formatCurrency";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { PartyType } from "~/gen/common";
import { useEffect } from "react";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { ActionToolbar } from "~/types/actions";
import { PlusIcon } from "lucide-react";
import { routes } from "~/util/route";
import { useCreatePurchaseInvoice } from "../home.buying.purchase-invoice.create/use-purchase-invoice";
import { formatLongDate, formatMediumDate } from "~/util/format/formatDate";
import { orderLineSchema } from "~/util/data/schemas/buying/purchase-schema";
import { z } from "zod";

export default function PurchaseOrderClient() {
  const { order, actions,associatedActions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>()
  const [purchaseOrderPermission] = usePermission({
    actions:actions,
    roleActions:globalState.roleActions
  })
  const [purchaseInvoicePermission] = usePermission({
    actions:associatedActions && associatedActions[PartyType[PartyType.purchaseInvoice]],
    roleActions:globalState.roleActions
  })
  const { t,i18n} = useTranslation("common");
  const toolbar = useToolbar()
  const createPurchaseInvoice = useCreatePurchaseInvoice()

  const r = routes
  const navigate = useNavigate()

  const setUpToolBar = ()=> {
    const actions:ActionToolbar[] = []
    if(purchaseInvoicePermission?.create) {
      actions.push({label:"Create Purchase Invoice",onClick:()=>{
        createPurchaseInvoice.setData({payload:{
            party_name:order?.party_name,
            party_uuid:order?.party_uuid,
            currency:order?.currency,
            order_uuid:order?.uuid,
            lines:order?.order_lines.map((line)=>{
              const d:z.infer<typeof orderLineSchema> =  {
                amount:line.amount,
                quantity:line.quantity.toString() as any,
                item_price:{
                  uuid:line.item_price_uuid,
                  rate:line.item_price_rate,
                  tax_value:line.tax_value,
                  item_code:line.item_code,
                  item_name:line.item_name,
                  item_uuid:line.item_uuid,
                  uom:line.uom,     
                }
              }
              return d
            }) || []
          // supplier:order.
        }})
        
        navigate(r.toPurchaseInvoiceCreate())
      },Icon:PlusIcon})
    }
    toolbar.setToolbar({
      actions:actions,
      title:"PURCHASE"
    })
  }


  useEffect(()=>{
    setUpToolBar()
  },[purchaseInvoicePermission])
  return (
    <div>
      <div className="info-grid">
        <Typography fontSize={subtitle} className=" col-span-full">
          {t("info")}
        </Typography>

        <DisplayTextValue title={t("_supplier.base")} value={order?.party_name} />
        <DisplayTextValue title={t("form.code")} value={order?.code} />
        <DisplayTextValue
          title={t("form.date")}
          value={formatMediumDate(order?.date,i18n.language)}
        />
        <DisplayTextValue
          title={t("form.deliveryDate")}
          value={formatMediumDate(order?.delivery_date,i18n.language)}
        />

        <div className=" col-span-full">
          <Typography fontSize={subtitle}>{t("_order.orderItems")}</Typography>
          <DataTable
            data={order?.order_lines || []}
            columns={displayItemLineColumns({ currency: order?.currency || "USD" })}
          />
          {(order && order?.order_lines.length > 0) &&
          <OrderSumary
          orderTotal={sumTotal(order?.order_lines.map(t=>t.amount))}
          orderTax={order.order_lines.reduce((prev,curr)=>{
            const taxPrice = curr.item_price_rate * ((Number(curr.tax_value))/100)
            return prev + taxPrice
          },0)}
          i18n={i18n}
          currency={order?.currency || DEFAULT_CURRENCY}
          />
        }
        </div>
      </div>
    </div>
  );
}
