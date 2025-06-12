import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatCurrency } from "~/util/format/formatCurrency";
import { formatLongDate } from "~/util/format/formatDate";
import TableCellDate from "../../cells/table-cell-date";
import { DEFAULT_CURRENCY } from "~/constant";
import { route } from "~/util/route";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { DataTableRowActions } from "../../data-table-row-actions";
import {
  itemPriceLineSchema,
  itemPriceSchema,
} from "~/util/data/schemas/stock/item-price-schema";
import { z } from "zod";
import TableCellEditable from "../../cells/table-cell-editable";
import { PriceListAutcomple } from "~/util/hooks/fetchers/use-pricelist-fetcher";
import { UomAutocomple } from "~/util/hooks/fetchers/use-uom-fetcher";

export const itemPriceColumns = ({
  includeItem,
}: {
  includeItem?: boolean;
}): ColumnDef<components["schemas"]["ItemPriceDto"]>[] => {
  const { t, i18n } = useTranslation("common");
  let columns: ColumnDef<components["schemas"]["ItemPriceDto"]>[] = [];
  const r = route;

  if (includeItem) {
    columns.push({
      accessorKey: "item_name",
      header: t("item.code"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(e) =>
              r.toRoute({
                main: r.itemPrice,
                routeSufix: [rowData.item_name],
                q: {
                  tab: "info",
                  id: rowData.id.toString(),
                },
              })
            }
          />
        );
      },
    });

    columns.push({ accessorKey: "item_code", id: "itemCode" });
  }

  columns.push({
    accessorKey: "rate",
    header: t("form.rate"),
    cell: ({ row }) => {
      const rowData = row.original;
      const currency = rowData.price_list_currency;
      return (
        <div className="">
          {formatCurrency(
            Number(rowData.rate),
            currency || DEFAULT_CURRENCY,
            i18n.language
          )}
        </div>
      );
    },
  });
  // columns.push({
  //   accessorKey: "price_list_currency",
  //   header:t("form.currency"),

  // });
  columns.push({
    accessorKey: "item_quantity",
    header: t("form.itemQuantity"),
  });
  columns.push({
    accessorKey: "created_at",
    header: t("table.createdAt"),
    cell: ({ ...props }) => {
      return <TableCellDate {...props} i18n={i18n} />;
    },
  });

  columns.push({
    accessorKey: "price_list_name",
    header: t("priceList"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellNameNavigation
          {...props}
          navigate={(e) =>
            r.toRoute({
              main: r.priceList,
              routePrefix: [r.stockM],
              routeSufix: [e],
              q: {
                tab: "info",
                id: rowData.price_list_uuid,
              },
            })
          }
        />
      );
    },
  });

  return columns;
};

export const itemPriceEditableColumns = (): ColumnDef<
  z.infer<typeof itemPriceLineSchema>
>[] => {
  let columns: ColumnDef<z.infer<typeof itemPriceLineSchema>>[] = [];
  const { t, i18n } = useTranslation("common");

  columns.push({
    accessorKey: "price_list_name",
    size: 200,
    header: t("priceList"),
    cell: ({ ...props }) => {
      const tableMeta: any = props.table.options.meta;
      return (
        <PriceListAutcomple
          defaultValue={props.row.original.price_list_name}
          allowEdit={!tableMeta?.disableEdit}
          onSelect={(e) => {
            tableMeta?.updateCell(props.row.index, "price_list_name", e.name);
            tableMeta?.updateCell(props.row.index, "price_list_id", e.id);
          }}
        />
      );
    },
  });

  columns.push({
    accessorKey: "uom_name",
    size: 200,
    header: t("form.uom"),
    cell: ({ ...props }) => {
      const tableMeta: any = props.table.options.meta;
      return (
        <UomAutocomple
          defaultValue={props.row.original.uom_name}
          allowEdit={!tableMeta?.disableEdit}
          onSelect={(e) => {
            tableMeta?.updateCell(props.row.index, "uom_name", e.name);
            tableMeta?.updateCell(props.row.index, "uom_id", e.id);
          }}
        />
      );
    },
  });

  columns.push({
    accessorKey: "rate",
    header: t("form.rate"),
    size: 100,
    cell: TableCellEditable,
    meta: {
      type: "number",
    },
  });

  columns.push({
    accessorKey: "item_quantity",
    size: 120,
    header: t("form.quantity"),
    cell: TableCellEditable,
    meta: {
      type: "number",
    },
  });

  columns.push({
    id: "actions",
    cell: DataTableRowActions,
  });
  return [...columns];
};
