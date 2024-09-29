import useEditTable from "~/util/hooks/useEditTable";
import { useAddLineOrder } from "./add-item-line";
import Typography, { subtitle } from "@/components/typography/Typography";
import { orderLineColumns } from "../../table/columns/order/order-line-column";
import { sumTotal } from "~/util/format/formatCurrency";
import OrderSumary from "../../display/order-sumary";
import { useTranslation } from "react-i18next";
import { DataTable } from "../../table/CustomTable";
import { DEFAULT_CURRENCY } from "~/constant";
import { useRevalidator } from "@remix-run/react";
import { useEffect } from "react";

export default function ItemLineForm({
    form
}:{
    form:any
}){
    const addLineOrder = useAddLineOrder();
    const {t,i18n} = useTranslation("common")
   const revalidator = useRevalidator();
    const [metaOptions] = useEditTable({
        form: form,
        name: "lines",
        onAddRow: () => {
          addLineOrder.openDialog({ currency:form.getValues().currency.code });
          console.log("ON ADD ROW");
        },
      });
      useEffect(() => {
        if (addLineOrder.orderLine) {
          const orderLines = form.getValues().lines;
          const n = [...orderLines, addLineOrder.orderLine];
          // console.log("LINES",orderLines,addLineOrder.orderLine)
          form.setValue("lines", n);
          addLineOrder.clearOrderLine()
          addLineOrder.onOpenChange(false);
          revalidator.revalidate();
        }
      }, [addLineOrder.orderLine]);
    return (
        <div>
        {/* {JSON.stringify(form.getValues())} */}
        <Typography fontSize={subtitle}>{t("items")}</Typography>
        <DataTable
          data={form.getValues().lines || []}
          columns={orderLineColumns({
            currency:form.getValues().currency.code
          })}
          metaOptions={{
            meta: {
              ...metaOptions,
              tooltipMessage: t("tooltip.selectCurrency"),
              enableTooltipMessage:
                form.getValues().currency == undefined,
            },
          }}
        />
         {(form.getValues().lines.length > 0) &&
          <OrderSumary
          orderTotal={sumTotal(form.getValues().lines?.map((item:any)=>item.amount ? item.amount :0))}
          orderTax={form.getValues().lines.reduce((prev:any,curr:any)=>{
            const taxPrice = curr.item_price.rate * ((Number(curr.item_price.tax_value))/100)
            return prev + taxPrice
          },0)}
          i18n={i18n}
          currency={addLineOrder.currency || DEFAULT_CURRENCY}
          />
        }
      </div>
    )
}