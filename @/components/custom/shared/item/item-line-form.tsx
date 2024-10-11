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
import { useWarehouseDebounceFetcher } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import FormAutocomplete from "../../select/FormAutocomplete";
import { ItemLineType } from "~/gen/common";
import useActionRow from "~/util/hooks/useActionRow";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import { lineItemSchema } from "~/util/data/schemas/stock/item-line-schema";
import { z } from "zod";

export default function ItemLineForm({
  form,
  configuteWarehouse = false,
  itemLineType,
}: {
  form: any;
  configuteWarehouse?: boolean;
  itemLineType:ItemLineType
}) {
  const [warehouseFetcher, onWarehouseChange] = useWarehouseDebounceFetcher({
    isGroup: false,
  });
  const addLineOrder = useAddLineOrder();

  const [rowMetaOptions] = useActionRow({})

  const { t, i18n } = useTranslation("common");
  const revalidator = useRevalidator();
  const [metaOptions] = useTableRowActions({
    onAddRow: () => {
      addLineOrder.openDialog({ currency: form.getValues().currency.code,itemLineType:itemLineType });
      console.log("ON ADD ROW");
    },
    onDelete:(rowIndex)=>{
      const orderLines:z.infer<typeof lineItemSchema>[] = form.getValues().lines;
      const f = orderLines.filter((_,idx)=>idx != rowIndex)
      form.setValue("lines", f);
      revalidator.revalidate();
    },
    onEdit:(rowIndex)=>{
      
    }
  });
  useEffect(() => {
    if (addLineOrder.orderLine) {
      const orderLines = form.getValues().lines;
      const n = [...orderLines, addLineOrder.orderLine];
      // console.log("LINES",orderLines,addLineOrder.orderLine)
      form.setValue("lines", n);
      addLineOrder.clearOrderLine();
      addLineOrder.onOpenChange(false);
      revalidator.revalidate();
    }
  }, [addLineOrder.orderLine]);
  return (
    <div>
      {configuteWarehouse && (
        <>
          <div className=" create-grid">
            <Typography fontSize={subtitle} className=" col-span-full">
              {t("warehouses")}
            </Typography>
            <FormAutocomplete
              form={form}
              data={warehouseFetcher.data?.warehouses || []}
              name="acceptedWarehouseName"
              nameK={"name"}
              onValueChange={onWarehouseChange}
              onSelect={(v) => {
                form.setValue("acceptedWarehouse", v.uuid);
              }}
              label={t("f.accepted", { o: t("_warehouse.base") })}
            />

            <FormAutocomplete
              form={form}
              data={warehouseFetcher.data?.warehouses || []}
              name="rejectedWarehouseName"
              nameK={"name"}
              onValueChange={onWarehouseChange}
              onSelect={(v) => {
                form.setValue("rejectedWarehouse", v.uuid);
              }}
              label={t("f.rejected", { o: t("_warehouse.base") })}
            />


          </div>
        </>
      )}
      {/* {JSON.stringify(form.getValues())} */}
      <Typography fontSize={subtitle}>{t("items")}</Typography>
      <DataTable
        data={form.getValues().lines || []}
        columns={orderLineColumns({
          currency: form.getValues().currency?.code || DEFAULT_CURRENCY,
          itemLineType:itemLineType
        })}
        metaOptions={{
          meta: {
            ...metaOptions,
            tooltipMessage: t("tooltip.selectCurrency"),
            enableTooltipMessage: form.getValues().currency?.code == undefined,
          },
        }}
      />
      {form.getValues().lines.length > 0 && (
        <OrderSumary
          orderTotal={sumTotal(
            form
              .getValues()
              .lines?.map((item: any) => (item.amount ? item.amount : 0))
          )}
          orderTax={form.getValues().lines.reduce((prev: any, curr: any) => {
            const taxPrice =
              curr.item_price.rate * (Number(curr.item_price.tax_value) / 100);
            return prev + taxPrice;
          }, 0)}
          i18n={i18n}
          currency={addLineOrder.currency || DEFAULT_CURRENCY}
        />
      )}
    </div>
  );
}
