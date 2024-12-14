import FallBack from "@/components/layout/Fallback";
import { Typography } from "@/components/typography";
import { Await } from "@remix-run/react";
import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ItemLineType, State, stateToJSON } from "~/gen/common";
import { components } from "~/sdk";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import { useItemLine } from "./item-line";
import { DataTable } from "../../table/CustomTable";
import {
  lineItemColumns,
  lineItemsColumns,
} from "../../table/columns/order/order-line-column";
import { DEFAULT_CURRENCY } from "~/constant";
import OrderSumary from "../../display/order-sumary";
import {
  formatAmount,
  formatCurrencyAmount,
  sumTotal,
} from "~/util/format/formatCurrency";
import { useTotal } from "~/util/hooks/data/useTotal";
import { useLineItems } from "./use-line-items";
import { z } from "zod";
import {
  LineItemType,
  lineItemDefault,
  lineItemSchema,
} from "~/util/data/schemas/stock/line-item-schema";
import DisplayTextValue from "../../display/DisplayTextValue";
import { Separator } from "@/components/ui/separator";
import { PriceAutocompleteForm } from "~/util/hooks/fetchers/useItemPriceForOrder";
import useEditableTable from "~/util/hooks/useEditableTable";

export default function LineItems({
  status,
  currency,
  docPartyType,
  docPartyID,
  lineType,
  allowEdit = true,
  allowCreate = true,
  onChange,
  complement,
  updateStock,
  isNew,
}: {
  onChange?: (e: z.infer<typeof lineItemSchema>[]) => void;
  status?: string;
  currency: string;
  docPartyType?: string;
  docPartyID?: number;
  allowEdit?: boolean;
  allowCreate?: boolean;
  lineType: string;
  complement?: JSX.Element;
  updateStock?: boolean;
  isNew?: boolean;
}) {
  const { t, i18n } = useTranslation("common");
  const { total, lines: lineItems, totalQuantity } = useLineItems();
  const itemLine = useItemLine();
  const shared = {
    currency: currency,
    docPartyType: docPartyType,
    docPartyID: docPartyID,
    allowEdit: allowEdit,
    updateStock: updateStock,
  };

  const [metaOptions] = useTableRowActions({
    ...(allowCreate && {
      onAddRow: () => {
        itemLine.onOpenDialog({
          ...shared,
          onEdit: (e) => {
            const lines = [...lineItems, e];
            if (onChange) {
              onChange(lines);
            }
          },
          line: lineItemDefault({
            lineType: lineType,
            updateStock: updateStock,
          }),
        });
      },
    }),
    onEdit: (rowIndex) => {
      const f = lineItems.find((t, idx) => idx == rowIndex);
      if (f) {
        itemLine.onOpenDialog({
          ...shared,
          line: f,
          onEdit: (e) => {
            const lines = lineItems.map((t, idx) => {
              if (idx == rowIndex) {
                t = e;
              }
              return t;
            });
            if (onChange) {
              onChange(lines);
            }
          },
          onDelete: () => {
            const f = lineItems.filter((t, idx) => idx != rowIndex);
            if (onChange) {
              onChange(f);
            }
          },
        });
      }
    },

    ...(onChange && {
      onDelete: (rowIndex) => {
        const f = lineItems.filter((t, idx) => idx != rowIndex);
        if (onChange) {
          onChange(f);
        }
      },
    }),
  });

  return (
    <>
      <Typography variant="subtitle2" className="col-span-full">
        {t("items")}
      </Typography>

      {complement}

      <div className=" col-span-full create-grid">
        {isNew && (
          <PriceAutocompleteForm
            allowEdit={allowEdit}
            label={t("item")}
            onSelect={(e) => {
              const line = lineItemDefault({
                lineType: lineType,
                updateStock: updateStock,
              });
              line.item_name = e.item_name;
              line.quantity = 0;
              line.item_code = e.item_code;
              line.rate = formatAmount(e.rate);
              line.item_price_id = e.id;
              line.uom = e.uom;
              onChange?.([...lineItems, line]);
            }}
            lang={i18n.language}
            docPartyType={docPartyType || ""}
          />
        )}
      </div>

      <div className=" col-span-full">
        <DataTable
          data={lineItems}
          columns={lineItemsColumns({
            currency: currency,
            lineType: lineType,
          })}
          metaOptions={{
            meta: {
              ...metaOptions,
              ...(isNew && {
                updateCell: (row: number, column: string, value: string) => {
                  console.log(row, column, value);
                  const lines = lineItems.map((t, idx) => {
                    if (idx == row) {
                      (t as any)[column] = value;
                    }
                    return t;
                  });
                  onChange?.(lines);
                },
              }),
            },
          }}
        />
      </div>
      <DisplayTextValue
        title="Total"
        value={formatCurrencyAmount(total, currency, i18n.language)}
      />
      <DisplayTextValue
        title="Cantidad Total"
        value={totalQuantity.toString()}
      />
    </>
  );
}
