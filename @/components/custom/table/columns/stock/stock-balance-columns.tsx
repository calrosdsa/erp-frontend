import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { routes } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellPrice from "../../cells/table-cell-price";
import { PartyType, partyTypeToJSON } from "~/gen/common";

export const stockBalanceColumns = ({}: {}): ColumnDef<
  components["schemas"]["StockBalanceEntryDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["StockBalanceEntryDto"]>[] = [];
  const r = routes;
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
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellNameNavigation
          navigate={(name) =>
            r.toRoute({
              main: partyTypeToJSON(PartyType.item),
              routePrefix: [r.stockM],
              routeSufix: [name],
              q: {
                tab: "info",
                id: rowData.item_uuid,
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
  });
  columns.push({
    accessorKey: "out_qty",
  });
  columns.push({
    accessorKey: "balance_qty",
  });
  columns.push({
    accessorKey: "balance_value",
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellPrice i18n={i18n} currency={rowData.currency} {...props} />
      );
    },
  });
  columns.push({
    accessorKey: "warehouse_name",
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
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellPrice i18n={i18n} currency={rowData.currency} {...props} />
      );
    },
  });

  return [...columns];
};
