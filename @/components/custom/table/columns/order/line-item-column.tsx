import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { route } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { z } from "zod";
import TableCellPrice from "../../cells/table-cell-price";
import TableCellIndex from "../../cells/table-cell-index";
import {
  formatAmount,
  formatTax,
  getTaxPorcent,
} from "~/util/format/formatCurrency";
import { lineItemSchema } from "~/util/data/schemas/stock/line-item-schema";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";
import { DataTableRowActions } from "../../data-table-row-actions";
import { Input } from "@/components/ui/input";
import TableCellEditable from "../../cells/table-cell-editable";
import { PriceAutocompleteForm } from "~/util/hooks/fetchers/use-item-price-for-order";
import { Link } from "@remix-run/react";

export const lineItemsColumns = ({
  currency,
  lineType,
  allowEdit,
  docPartyType,
  priceListID,
}: {
  currency: string;
  lineType: string;
  allowEdit?: boolean;
  docPartyType?: string;
  priceListID?: number;
}): ColumnDef<z.infer<typeof lineItemSchema>>[] => {
  let columns: ColumnDef<z.infer<typeof lineItemSchema>>[] = [];
  const r = route;
  const { t, i18n } = useTranslation("common");
  columns.push({
    id: "item",
    size: 250,
    header: t("item"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      const tableMeta: any = props.table.options.meta;
      if (!allowEdit) {
        return <Link className=" underline" to={route.toRouteDetail(route.item,rowData.item_name,{
          tab:"info",
          id:rowData.item_code
        })}>{rowData.item_name}</Link>;
      }
      return (
        <PriceAutocompleteForm
          allowEdit={allowEdit}
          currency={currency}
          defaultValue={rowData.item_name}
          onSelect={(e) => {
            tableMeta?.updateCell(props.row.index, "item_name", e.item_name);
            tableMeta?.updateCell(props.row.index, "item_code", e.item_code);
            tableMeta?.updateCell(props.row.index, "uom", e.item_uom);
            tableMeta?.updateCell(props.row.index, "itemID", e.item_id);
            tableMeta?.updateCell(
              props.row.index,
              "unitOfMeasureID",
              e.item_uom_id
            );
            tableMeta?.updateCell(props.row.index, "quantity", 1);
            tableMeta?.updateCell(
              props.row.index,
              "rate",
              formatAmount(e.rate)
            );
            // tableMeta?.updateCell(props.row.index, "payment_term_id", e.id);
          }}
          priceListID={priceListID}
          lang={i18n.language}
          docPartyType={docPartyType || ""}
        />
      );
    },
  });

  columns.push({
    accessorKey: "item_code",
    header: t("_item.code"),
  });
  // columns.push({
  //   accessorKey: "item_name",
  //   header: t("form.name"),
  // });
  columns.push({
    accessorKey: "uom",
    header: t("form.uom"),
  });
  // columns.push({
  //   accessorKey: "item_price.uom",
  //   header: t("form.uom"),
  // });

  // if(lineType != itemLineTypeToJSON(ItemLineType.ITEM_LINE_RECEIPT)) {
  columns.push({
    accessorKey: "quantity",
    header: t("_item.quantity"),
    cell: TableCellEditable,
    meta: {
      type: "number",
    },
  });
  // }

  // if (lineType == itemLineTypeToJSON(ItemLineType.ITEM_LINE_RECEIPT)) {
  //   columns.push({
  //     accessorKey: "lineItemReceipt.acceptedQuantity",
  //     header: t("f.accepted", { o: t("form.quantity") }),
  //     cell: TableCell,
  //     meta:{
  //       type:"number",
  //     }
  //   });
  //   columns.push({
  //     accessorKey: "lineItemReceipt.rejectedQuantity",
  //     header: t("f.rejected", { o: t("form.quantity") }),
  //     cell: TableCell,
  //     meta:{
  //       type:"number",
  //     }
  //   });
  // }

  columns.push({
    accessorKey: "rate",
    header: t("form.rate"),
    cell: TableCellEditable,
    meta: {
      type: "number",
    },
  });

  columns.push({
    accessorKey: "amount",
    header: t("form.amount"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return currency ? (
        <TableCellPrice
          {...props}
          currency={currency}
          i18n={i18n}
          price={rowData.rate * Number(rowData.quantity)}
          isAmount={true}
        />
      ) : (
        "-"
      );
    },
  });

  columns.push({
    id: "actions",
    cell: DataTableRowActions,
    size: 35,
  });

  return [...columns];
};

//FOR DISPLAY ITEM LINES IN ORDERS,INVOICE AND RECEIPT
export const displayItemLineColumns = ({
  currency,
}: {
  currency?: string;
}): ColumnDef<components["schemas"]["ItemLineDto"]>[] => {
  let columns: ColumnDef<components["schemas"]["ItemLineDto"]>[] = [];
  const r = route;
  const { t, i18n } = useTranslation("common");
  columns.push({
    header: t("table.no"),
    cell: TableCellIndex,
  });
  columns.push({
    accessorKey: "item_code",
    header: t("_item.code"),
  });
  columns.push({
    accessorKey: "item_name",
    header: t("form.name"),
  });
  // columns.push({
  //   accessorKey: "uom",
  //   header: t("form.uom"),
  // });
  columns.push({
    accessorKey: "quantity",
    header: t("_item.quantity"),
  });

  columns.push({
    accessorKey: "rate",
    header: t("form.rate"),
    cell: ({ ...props }) => {
      return currency ? (
        <TableCellPrice {...props} currency={currency} i18n={i18n} />
      ) : (
        "-"
      );
    },
  });

  columns.push({
    id: "amount",
    header: t("form.amount"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      const total = rowData.rate * rowData.quantity;
      return currency ? (
        <TableCellPrice
          {...props}
          currency={currency}
          i18n={i18n}
          price={total}
        />
      ) : (
        "-"
      );
    },
  });

  // columns.push({
  //   accessorKey: "amount",
  //   header: t("form.tax"),
  //   cell: ({ ...props }) => {
  //     const rowData = props.row.original
  //     const taxPrice = getTaxPorcent(rowData.tax_value,rowData.item_price_rate,currency,i18n.language)
  //     return currency ? (
  //       <TableCellPrice {...props} currency={currency} i18n={i18n} price={taxPrice}/>
  //     ) : (
  //       "-"
  //     );
  //   },
  // });

  columns.push({
    id: "actions-row",
    cell: DataTableRowActions,
  });
  return [...columns];
};

//FOR DISPLAY ITEM LINES IN ORDERS,INVOICE AND RECEIPT
export const lineItemColumns = ({
  currency,
}: {
  currency?: string;
}): ColumnDef<components["schemas"]["LineItemDto"]>[] => {
  let columns: ColumnDef<components["schemas"]["LineItemDto"]>[] = [];
  const r = route;
  const { t, i18n } = useTranslation("common");
  columns.push({
    header: t("table.no"),
    cell: TableCellIndex,
  });
  columns.push({
    accessorKey: "item_code",
    header: t("_item.code"),
  });
  columns.push({
    accessorKey: "item_name",
    header: t("form.name"),
  });
  // columns.push({
  //   accessorKey: "uom",
  //   header: t("form.uom"),
  // });
  columns.push({
    accessorKey: "quantity",
    header: t("_item.quantity"),
  });

  columns.push({
    accessorKey: "rate",
    header: t("form.rate"),
    cell: ({ ...props }) => {
      return currency ? (
        <TableCellPrice {...props} currency={currency} i18n={i18n} />
      ) : (
        "-"
      );
    },
  });

  columns.push({
    id: "amount",
    header: t("form.amount"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      const total = rowData.rate * rowData.quantity;
      return currency ? (
        <TableCellPrice
          {...props}
          currency={currency}
          i18n={i18n}
          price={total}
        />
      ) : (
        "-"
      );
    },
  });

  // columns.push({
  //   accessorKey: "amount",
  //   header: t("form.tax"),
  //   cell: ({ ...props }) => {
  //     const rowData = props.row.original
  //     const taxPrice = getTaxPorcent(rowData.tax_value,rowData.item_price_rate,currency,i18n.language)
  //     return currency ? (
  //       <TableCellPrice {...props} currency={currency} i18n={i18n} price={taxPrice}/>
  //     ) : (
  //       "-"
  //     );
  //   },
  // });

  columns.push({
    id: "actions-row",
    cell: DataTableRowActions,
  });
  return [...columns];
};
