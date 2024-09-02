import Typography from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { components } from "index";
import { formatLongDate } from "~/util/format/formatDate";
import { routes } from "~/util/route";
import TableCellBoolean from "../../cells/table-cell-chek";
import TableCellDate from "../../cells/table-cell-date";
import TableCellQuantity from "../../cells/table-cell-quantity";
import { DataTableRowActions } from "../../data-table-row-actions";
import TableCellNavigate from "../../cells/table-cell-navigate";

export const itemStockColums = ({
  includeWarehouse = false,
  includeItem = false,
}: {
  includeWarehouse?: boolean;
  includeItem?: boolean;
}): ColumnDef<components["schemas"]["StockLevel"]>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  let columns: ColumnDef<components["schemas"]["StockLevel"]>[] = [];
  if (includeWarehouse) {
    columns.push({
      accessorKey: "WareHouse.Code",
      id: "warehouseCode",
    });
    columns.push({
      accessorKey: "WareHouse.Name",
      id: "warehouseName",
      header: t("_warehouse.base"),
      cell: ({ ...props }) => <TableCellNavigate
      {...props}
      id="warehouseCode"
      navigate={(name,id)=>r.toWarehouseItems(id)}
      />
    });
  }

  if (includeItem) {
    columns.push({
      accessorKey: "Item.Code",
      id: "itemCode",
    });
    columns.push({
      accessorKey: "Item.Name",
      id: "itemName",
      header: t("_item.base"),
      cell: ({ ...props }) => <TableCellNavigate
      {...props}
      id="itemCode"
      navigate={(name,id)=>r.toItemDetailStock(id)}
      />
    }); 
  }

  return [
    ...columns,
    {
      accessorKey: "Stock",
      header: t("stock"),
      cell: TableCellQuantity,
    },
    {
      accessorKey: "OutOfStockThreshold",
      header: t("form.outOfStockThreshold"),
      cell: TableCellQuantity,
    },
    {
      accessorKey: "CreatedAt",
      header: t("table.createdAt"),
      cell: ({ ...props }) => <TableCellDate i18n={i18n} {...props} />,
    },
    {
      accessorKey: "Enabled",
      header: t("form.enabled"),
      cell: TableCellBoolean,
    },
    {
      id: "actions",
      cell: DataTableRowActions,
    },
  ];
};
