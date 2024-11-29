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
import { formatCurrencyAmount, sumTotal } from "~/util/format/formatCurrency";
import { useTotal } from "~/util/hooks/data/useTotal";
import { useLineItems } from "./use-line-items";
import { z } from "zod";
import { lineItemSchema } from "~/util/data/schemas/stock/line-item-schema";
import DisplayTextValue from "../../display/DisplayTextValue";
import { Separator } from "@/components/ui/separator";

export default function LineItems({
  status,
  currency,
  partyType,
  itemLineType,
  allowEdit,
  onChange,
  complement,
}: {
  onChange?: (e: z.infer<typeof lineItemSchema>[]) => void;
  status?: string;
  currency: string;
  partyType: string;
  allowEdit?: boolean;
  itemLineType: ItemLineType;
  complement?: JSX.Element;
}) {
  const { t, i18n } = useTranslation("common");
  const { total, lines: lineItems, totalQuantity } = useLineItems();
  const itemLine = useItemLine();
  const shared = {
    currency: currency,
    partyType: partyType,
    allowEdit: allowEdit || true,
    itemLineType: itemLineType,
  };
  const [metaOptions] = useTableRowActions({
    onAddRow: () => {
      itemLine.onOpenDialog({
        ...shared,
        onEditItemForm: (e) => {
          const lines = [...lineItems, e];
          if (onChange) {
            onChange(lines);
          }
        },
      });
    },
    onEdit: (rowIndex) => {
      const f = lineItems.find((t, idx) => idx == rowIndex);
      if (f) {
        itemLine.onOpenDialog({
          ...shared,
          line: f,
          onEditItemForm: (e) => {
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
        });
      }
    },
  });

  return (
    <>
      <Separator className=" col-span-full" />
      <Typography variant="subtitle2" className="col-span-full">
        {t("items")}
      </Typography>

      {complement}
      <div className=" col-span-full">
        {/* {JSON.stringify(lineItems)} */}
        <DataTable
          data={lineItems}
          columns={lineItemsColumns({
            currency: currency,
            itemLineType: itemLineType,
          })}
          metaOptions={{
            meta: {
              ...metaOptions,
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
