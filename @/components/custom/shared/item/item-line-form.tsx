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
import { ItemLineType, PartyType } from "~/gen/common";
import useActionRow from "~/util/hooks/useActionRow";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import {
  editLineItemSchema,
  lineItemSchema,
  mapToItemLineDto,
} from "~/util/data/schemas/stock/item-line-schema";
import { z } from "zod";
import { useItemLine } from "./item-line";

export default function ItemLineForm({
  form,
  configuteWarehouse = false,
  itemLineType,
  partyType,
}: {
  form: any;
  configuteWarehouse?: boolean;
  itemLineType: ItemLineType;
  partyType: string;
}) {
  const [warehouseFetcher, onWarehouseChange] = useWarehouseDebounceFetcher({
    isGroup: false,
  });
  const addLineOrder = useAddLineOrder();
  const itemLine = useItemLine();

  const { t, i18n } = useTranslation("common");
  const revalidator = useRevalidator();
  const [metaOptions] = useTableRowActions({
    onAddRow: () => {
      itemLine.onOpenDialog({
        allowEdit: true,
        partyType: partyType,
        currency: form.getValues().currency.code,
        itemLineType: itemLineType,
        onEditItemForm: (e) => {
          const orderLines = form.getValues().lines;
          const n = [...orderLines, e];
          // console.log("LINES",orderLines,addLineOrder.orderLine)
          form.setValue("lines", n);
          revalidator.revalidate();
        },
      });
      // addLineOrder.openDialog({ currency: form.getValues().currency.code,itemLineType:itemLineType });
      console.log("ON ADD ROW");
    },
    onDelete: (rowIndex) => {
      const orderLines: z.infer<typeof editLineItemSchema>[] =
        form.getValues().lines;
      const f = orderLines.filter((_, idx) => idx != rowIndex);
      form.setValue("lines", f);
      revalidator.revalidate();
    },
    onEdit: (rowIndex) => {
      const orderLines: z.infer<typeof editLineItemSchema>[] =
        form.getValues().lines;
      const f = orderLines.find((_, idx) => idx == rowIndex);
      if (f) {
        const line = mapToItemLineDto(f);
        itemLine.onOpenDialog({
          allowEdit: true,
          partyType: partyType,
          currency: form.getValues().currency.code,
          itemLineType: itemLineType,
          lineReference:f.itemLineReference,
          line: line,
          onEditItemForm: (e) => {
            const orderLines: z.infer<typeof editLineItemSchema>[] =
              form.getValues().lines;
            const n = orderLines.map((t, idx) => {
              if (idx == rowIndex) {
                t = e;
              }
              return t;
            });
            form.setValue("lines", n);
          },
        });
      }
    },
  });
  // useEffect(() => {
  //   if (itemLine.newItemLine) {
  //     const orderLines = form.getValues().lines;
  //     const n = [...orderLines, addLineOrder.orderLine];
  //     // console.log("LINES",orderLines,addLineOrder.orderLine)
  //     form.setValue("lines", n);
  //     itemLine.setNewItemLine(undefined);
  //     addLineOrder.onOpenChange(false);

  //     revalidator.revalidate();
  //   }
  // }, [itemLine.newItemLine]);
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
          itemLineType: itemLineType,
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
          orderTax={0}
          i18n={i18n}
          currency={addLineOrder.currency || DEFAULT_CURRENCY}
        />
      )}
    </div>
  );
}
