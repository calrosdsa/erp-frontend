import FallBack from "@/components/layout/Fallback";
import { Typography } from "@/components/typography";
import { Await } from "@remix-run/react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { ItemLineType, State, stateToJSON } from "~/gen/common";
import { components } from "~/sdk";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import { useItemLine } from "./item-line";
import { DataTable } from "../../table/CustomTable";
import { lineItemColumns } from "../../table/columns/order/order-line-column";
import { DEFAULT_CURRENCY } from "~/constant";
import OrderSumary from "../../display/order-sumary";
import { sumTotal } from "~/util/format/formatCurrency";

export default function LineItems({
  lineItems,
  status,
  currency,
  partyType,
  itemLineType,
}: {
  lineItems: any;
  status: string;
  currency: string;
  partyType: string;
  itemLineType: ItemLineType;
}) {
  const { t, i18n } = useTranslation("common");
  const itemLine = useItemLine();
  return (
    <div className=" col-span-full pt-3">
      <Typography variant="subtitle2">{t("items")}</Typography>

      <Suspense fallback={<FallBack />}>
        <Await resolve={lineItems}>
          {(resData: any) => {
            const { result: lineItems } =
              resData.data as components["schemas"]["ResponseDataListLineItemDtoBody"];
            const [metaOptions] = useTableRowActions({
              onEdit: (rowIndex) => {
                const line = lineItems[rowIndex];
                itemLine.onOpenDialog({
                  title: t("f.editRow", { o: `#${rowIndex}` }),
                  allowEdit: status == stateToJSON(State.DRAFT),
                  line: line,
                  currency: currency,
                  partyType: partyType,
                  itemLineType: itemLineType,
                  ...(itemLineType == ItemLineType.ITEM_LINE_RECEIPT && {
                    lineItemReceipt: {
                      acceptedQuantity: Number(line?.accepted_quantity),
                      rejectedQuantity: Number(line?.rejected_quantity),
                      acceptedWarehouseName: line?.accepted_warehouse,
                      rejectedWarehouseName: line?.rejected_warehouse,
                    },
                  }),
                });
              },
            });
            return (
              <div>
                <DataTable
                  data={lineItems || []}
                  columns={lineItemColumns({
                    currency: currency || DEFAULT_CURRENCY,
                  })}
                  metaOptions={{
                    meta: {
                      ...metaOptions,
                    },
                  }}
                />

                {lineItems.length > 0 && (
                  <OrderSumary
                    orderTotal={sumTotal(
                      lineItems.map((t) => t.rate * t.quantity)
                    )}
                    orderTax={100}
                    i18n={i18n}
                    currency={currency || DEFAULT_CURRENCY}
                  />
                )}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
