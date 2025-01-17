import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { route } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellPrice from "../../cells/table-cell-price";
import { PartyType, partyTypeToJSON } from "~/gen/common";

export const stockBalanceColumns = ({}: {}): ColumnDef<
  components["schemas"]["StockBalanceEntryDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["StockBalanceEntryDto"]>[] = [];
  const r = route;
  const { t, i18n } = useTranslation("common");

  columns.push({
    accessorKey: "date",
    header: t("form.date"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return <TableCellDate {...props} i18n={i18n} formatDate="medium" />;
    },
  });

  columns.push({
    accessorKey: "item_name",
    header: t("item"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellNameNavigation
          navigate={(name) =>
            r.toRoute({
              main: r.itemM,
              routePrefix: [r.stockM],
              routeSufix: [name],
              q: {
                tab: "info",
                id: rowData.item_code,
              },
            })
          }
          {...props}
        />
      );
    },
  });
  columns.push({
    accessorKey: "stock_uom",
    header: t("form.uom"),
  });

  columns.push({
    accessorKey: "in_qty",
    header: t("form.inQty"),
  });
  columns.push({
    accessorKey: "out_qty",
    header: t("form.outQty"),
  });
  columns.push({
    accessorKey: "balance_qty",
    header: t("form.balanceQty"),
  });
  columns.push({
    accessorKey: "balance_value",
    header: t("form.balanceValue"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellPrice i18n={i18n} currency={rowData.currency} {...props} />
      );
    },
  });
  columns.push({
    accessorKey: "warehouse_name",
    header: t("warehouse"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellNameNavigation
          navigate={(name) =>
            r.toRoute({
              main: partyTypeToJSON(PartyType.warehouse),
              routePrefix: [r.stockM],
              routeSufix: [name],
              q: {
                tab: "info",
                id: rowData.warehouse_uuid,
              },
            })
          }
          {...props}
        />
      );
    },
  });

  columns.push({
    accessorKey: "average_rate",
    header: t("form.averageRate"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellPrice i18n={i18n} currency={rowData.currency} {...props} />
      );
    },
  });

  return [...columns];
};
