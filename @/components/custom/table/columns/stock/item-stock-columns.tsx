import Typography from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { formatLongDate } from "~/util/format/formatDate";
import { routes } from "~/util/route";
import TableCellBoolean from "../../cells/table-cell-chek";
import TableCellDate from "../../cells/table-cell-date";
import TableCellQuantity from "../../cells/table-cell-quantity";
import { DataTableRowActions } from "../../data-table-row-actions";
import TableCellNavigate from "../../cells/table-cell-navigate";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";

export const itemStockColums = ({
  includeWarehouse = false,
  includeItem = false,
}: {
  includeWarehouse?: boolean;
  includeItem?: boolean;
}): ColumnDef<components["schemas"]["StockLevelDto"]>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  let columns: ColumnDef<components["schemas"]["StockLevelDto"]>[] = [];
  if (includeWarehouse) {
    columns.push({
      accessorKey: "warehouse_name",
      header: t("_warehouse.base"),
      cell: ({ ...props }) => {
        const rowData = props.row.original
      return <TableCellNameNavigation
      {...props}
      navigate={(name)=>r.toWarehouseItems(name,rowData.warehouse_uuid)}
      />
    }
    });
  }

  if (includeItem) {
   
    columns.push({
      accessorKey: "item_name",
      header: t("_item.base"),
      cell: ({ ...props }) => {
        const rowData = props.row.original
      return <TableCellNameNavigation
      {...props}
      navigate={(name)=>r.toItemDetailStock(name,rowData.item_uuid)}
      />
      }
    }); 
  }

  return [
    ...columns,
    {
      accessorKey: "stock",
      header: t("stock"),
      cell: TableCellQuantity,
    },
    {
      accessorKey: "out_of_stock_threshold",
      header: t("form.outOfStockThreshold"),
      cell: TableCellQuantity,
    },
    {
      accessorKey: "created_at",
      header: t("table.createdAt"),
      cell: ({ ...props }) => <TableCellDate i18n={i18n} {...props} />,
    },
    {
      accessorKey: "enabled",
      header: t("form.enabled"),
      cell: TableCellBoolean,
    },
    {
      id: "actions",
      cell: DataTableRowActions,
    },
  ];
};
