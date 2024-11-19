import useEditTable from "~/util/hooks/useEditTable";
import { useAddLineOrder } from "./add-item-line";
import Typography, { subtitle } from "@/components/typography/Typography";
import { orderLineColumns } from "../../table/columns/order/order-line-column";
import { formatAmountToInt, sumTotal } from "~/util/format/formatCurrency";
import OrderSumary from "../../display/order-sumary";
import { useTranslation } from "react-i18next";
import { DataTable } from "../../table/CustomTable";
import { DEFAULT_CURRENCY } from "~/constant";
import { useOutletContext, useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
import { useWarehouseDebounceFetcher } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import FormAutocomplete from "../../select/FormAutocomplete";
import { ItemLineType, PartyType } from "~/gen/common";
import useActionRow from "~/util/hooks/useActionRow";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import {
  editLineItemSchema,
  mapToItemLineDto,
} from "~/util/data/schemas/stock/item-line-schema";
import { z } from "zod";
import { useItemLine } from "./item-line";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { FontRomanIcon } from "@radix-ui/react-icons";
import { UseFormReturn } from "react-hook-form";
import { useCreateWareHouse } from "~/routes/home.stock.warehouse_/components/add-warehouse";

export default function ItemLineForm({
  form,
  configuteWarehouse = false,
  itemLineType,
  partyType,
}: {
  form:UseFormReturn<any>;
  configuteWarehouse?: boolean;
  itemLineType: ItemLineType;
  partyType: string;
}) {
  const globalState = useOutletContext<GlobalState>();
  const [warehouseFetcher, onWarehouseChange] = useWarehouseDebounceFetcher({
    isGroup: false,
  });
  const [permissionWarehouse] = usePermission({
    actions: warehouseFetcher.data?.actions,
    roleActions: globalState.roleActions,
  });
  const createWareHouse = useCreateWareHouse();

  const addLineOrder = useAddLineOrder();
  const itemLine = useItemLine();

  const { t, i18n } = useTranslation("common");
  const [metaOptions] = useTableRowActions({
    onAddRow: () => {
      itemLine.onOpenDialog({
        allowEdit: true,
        partyType: partyType,
        currency: form.getValues().currency.code,
        itemLineType: itemLineType,
        ...(itemLineType == ItemLineType.ITEM_LINE_RECEIPT && {
          lineItemReceipt: {
            acceptedWarehouse: form.getValues().acceptedWarehouse,
            acceptedWarehouseName: form.getValues().acceptedWarehouseName,
            rejectedWarehouse: form.getValues().rejectedWarehouse,
            rejectedWarehouseName: form.getValues().rejectedWarehouseName,
            acceptedQuantity: 0,
            rejectedQuantity: 0,
          },
        }),
        onEditItemForm: (e) => {
          const orderLines = form.getValues().lines;
          e.rate = formatAmountToInt(e.rate);
          const n = [...orderLines, e];
          // console.log("LINES",orderLines,addLineOrder.orderLine)
          form.setValue("lines", n);
          form.trigger("lines");
          
        },
      });
      // addLineOrder.openDialog({ currency: form.getValues().currency.code,itemLineType:itemLineType });
    },
    onDelete: (rowIndex) => {
      const orderLines: z.infer<typeof editLineItemSchema>[] =
        form.getValues().lines;
      const f = orderLines.filter((_, idx) => idx != rowIndex);
      form.setValue("lines", f);
      form.trigger("lines");
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
          lineReference: f.itemLineReference,
          line: line,
          onEditItemForm: (e) => {
            console.log("EDITED ITEM",e)
            const orderLines: z.infer<typeof editLineItemSchema>[] =
              form.getValues().lines;
            const n = orderLines.map((t, idx) => {
              if (idx == rowIndex) {
                e.rate = formatAmountToInt(e.rate)
                e.itemLineReference = f.itemLineReference
                t = e;

              }
              return t;
            });
            form.setValue("lines", n);
            form.trigger("lines");

          },
        });
      }
    },
  });

  return (
    <div className="col-span-full">
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
                form.setValue("acceptedWarehouse", v.id);
              }}
              label={t("f.accepted", { o: t("_warehouse.base") })}
              {...(permissionWarehouse?.create && {
                addNew: () => {
                  createWareHouse.openDialog({});
                },
              })}
            />

            <FormAutocomplete
              form={form}
              data={warehouseFetcher.data?.warehouses || []}
              name="rejectedWarehouseName"
              nameK={"name"}
              onValueChange={onWarehouseChange}
              onSelect={(v) => {
                form.setValue("rejectedWarehouse", v.id);
              }}
              label={t("f.rejected", { o: t("_warehouse.base") })}
              {...(permissionWarehouse?.create && {
                addNew: () => {
                  createWareHouse.openDialog({});
                },
              })}
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
            enableTooltipMessage:
              form.getValues().currency?.code == undefined ||
              form.getValues().currency.code == "",
            },
        }}
        />
      {form.getValues().lines.length > 0 && (
        <OrderSumary
          orderTotal={sumTotal(
            form
              .getValues()
              .lines?.map(
                (item: z.infer<typeof editLineItemSchema>) =>
                  item.rate * Number(item.quantity)
              )
            )}
            orderTax={0}
            i18n={i18n}
          currency={addLineOrder.currency || DEFAULT_CURRENCY}
          />
      )}
    </div>
  );
}
