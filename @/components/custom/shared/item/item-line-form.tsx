import Typography, { subtitle } from "@/components/typography/Typography";
import { orderLineColumns } from "../../table/columns/order/order-line-column";
import { formatAmountToInt, sumTotal } from "~/util/format/formatCurrency";
import OrderSumary from "../../display/order-sumary";
import { useTranslation } from "react-i18next";
import { DataTable } from "../../table/CustomTable";
import { DEFAULT_CURRENCY } from "~/constant";
import { useOutletContext } from "@remix-run/react";
import { useWarehouseDebounceFetcher } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import FormAutocomplete from "../../select/FormAutocomplete";
import { ItemLineType, PartyType, partyTypeToJSON } from "~/gen/common";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import {
  lineItemSchema,
  mapToItemLineDto,
} from "~/util/data/schemas/stock/line-item-schema";
import { z } from "zod";
import { useItemLine } from "./item-line";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { UseFormReturn } from "react-hook-form";
import { useCreateWareHouse } from "~/routes/home.stock.warehouse_/components/add-warehouse";
import CustomFormField from "../../form/CustomFormField";
import CheckForm from "../../input/CheckForm";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomCheckbox } from "../../input/CustomCheckBox";

export default function ItemLineForm({
  form,
  configuteWarehouse = false,
  itemLineType,
  partyType,
}: {
  form: UseFormReturn<any>;
  configuteWarehouse?: boolean;
  itemLineType: ItemLineType;
  partyType: string;
}) {
  const formValues = form.getValues()
  const globalState = useOutletContext<GlobalState>();
  const [warehouseFetcher, onWarehouseChange] = useWarehouseDebounceFetcher({
    isGroup: false,
  });
  const [permissionWarehouse] = usePermission({
    actions: warehouseFetcher.data?.actions,
    roleActions: globalState.roleActions,
  });
  const createWareHouse = useCreateWareHouse();
  const isSaleInvoice = partyType == partyTypeToJSON(PartyType.saleInvoice)
  const isPurchaseInvoice = partyType == partyTypeToJSON(PartyType.purchaseInvoice)
  const itemLine = useItemLine();

  const { t, i18n } = useTranslation("common");
  const [metaOptions] = useTableRowActions({
    onAddRow: () => {
      itemLine.onOpenDialog({
        allowEdit: true,
        partyType: partyType,
        currency: formValues.currency,
        itemLineType: itemLineType,
        ...(itemLineType == ItemLineType.ITEM_LINE_RECEIPT && {
          lineItemReceipt: {
            acceptedWarehouse: formValues.acceptedWarehouse,
            acceptedWarehouseName: formValues.acceptedWarehouseName,
            rejectedWarehouse: formValues.rejectedWarehouse,
            rejectedWarehouseName: formValues.rejectedWarehouseName,
            acceptedQuantity: 0,
            rejectedQuantity: 0,
          },
        }),
        onEditItemForm: (e) => {
          const orderLines = formValues.lines;
          e.rate = formatAmountToInt(e.rate);
          const n = [...orderLines, e];
          // console.log("LINES",orderLines,addLineOrder.orderLine)
          form.setValue("lines", n);
          form.trigger("lines");
        },
      });
      // addLineOrder.openDialog({ currency: formValues.currency.code,itemLineType:itemLineType });
    },
    onDelete: (rowIndex) => {
      const orderLines: z.infer<typeof lineItemSchema>[] =
        formValues.lines;
      const f = orderLines.filter((_, idx) => idx != rowIndex);
      form.setValue("lines", f);
      form.trigger("lines");
    },
    onEdit: (rowIndex) => {
      const orderLines: z.infer<typeof lineItemSchema>[] =
        formValues.lines;
      const f = orderLines.find((_, idx) => idx == rowIndex);
      if (f) {
        const line = mapToItemLineDto(f);
        itemLine.onOpenDialog({
          allowEdit: true,
          partyType: partyType,
          currency: formValues.currency,
          itemLineType: itemLineType,
          lineReference: f.itemLineReference,
          lineItemReceipt: {
            acceptedQuantity: Number(f.quantity),
            rejectedQuantity: 0,
            acceptedWarehouseName: f.lineItemReceipt?.acceptedWarehouseName,
            rejectedWarehouseName: f.lineItemReceipt?.rejectedWarehouseName,
          },
          line: line,
          onEditItemForm: (e) => {
            console.log("EDITED ITEM", e);
            const orderLines: z.infer<typeof lineItemSchema>[] =
              formValues.lines;
            const n = orderLines.map((t, idx) => {
              if (idx == rowIndex) {
                e.rate = formatAmountToInt(e.rate);
                e.itemLineReference = f.itemLineReference;
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
      <Typography fontSize={subtitle}>{t("items")}</Typography>
      {(isSaleInvoice || isPurchaseInvoice) && 
        <div className="py-4 create-grid">
          <CustomFormField
          form={form.control}
          name="updateStock"
          children={(field)=>{
            return  <CustomCheckbox
            checked={field.value}
            onCheckedChange={field.onChange}
            label={t("form.updateStock")}
          />
          }}
          />
          {(isSaleInvoice && formValues.updateStock) && 
           <FormAutocomplete
           form={form}
           data={warehouseFetcher.data?.warehouses || []}
           name="sourceWarehouseName"
           nameK={"name"}
           onValueChange={onWarehouseChange}
           onSelect={(v) => {
             form.setValue("sourceWarehouse", v.id);
           }}
           label={t("f.source", { o: t("_warehouse.base") })}
           {...(permissionWarehouse?.create && {
             addNew: () => {
               createWareHouse.openDialog({});
             },
           })}
         />
          }

        </div>
        }

      <DataTable
        data={formValues.lines || []}
        columns={orderLineColumns({
          currency: formValues.currency || DEFAULT_CURRENCY,
          itemLineType: itemLineType,
        })}
        metaOptions={{
          meta: {
            ...metaOptions,
            tooltipMessage: t("tooltip.selectCurrency"),
            enableTooltipMessage:
              formValues.currency == undefined ||
              formValues.currency == "",
          },
        }}
      />
      {formValues.lines.length > 0 && (
        <OrderSumary
          orderTotal={sumTotal(
            form
              .getValues()
              .lines?.map(
                (item: z.infer<typeof lineItemSchema>) =>
                  item.rate * Number(item.quantity)
              )
          )}
          orderTax={0}
          i18n={i18n}
          currency={formValues.currency || DEFAULT_CURRENCY}
        />
      )}
    </div>
  );
}
