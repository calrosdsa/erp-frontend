import Typography from "@/components/typography/Typography";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatLongDate } from "~/util/format/formatDate";
import { routes } from "~/util/route";
import TableCellBoolean from "../../cells/table-cell-chek";
import TableCellDate from "../../cells/table-cell-date";
import TableCellQuantity from "../../cells/table-cell-quantity";
import { DataTableRowActions } from "../../data-table-row-actions";

export const itemStockColums = (): ColumnDef<components["schemas"]["StockLevel"]>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return [
    // {
    //   accessorKey: "Code",
    //   header: t("form.code"),
    //   cell: ({ row }) => {
    //     const code = row.getValue("Code") as string;
    //     return (
    //       <div className=" uppercase">
    //         <Link to={r.toTaxDetail(code)}>
    //           <Typography className=" text-primary underline cursor-pointer">
    //             {code}
    //           </Typography>
    //         </Link>
    //       </div>
    //     );
    //   },
    // },
    {
        accessorKey:"WareHouse.Code",
        id:"warehouseCode",        
    },
    {
        accessorKey:"WareHouse.Name",
        id:"warehouseName",
        header:t("_warehouse.base"),
        cell: ({ row }) => {
            const code = row.getValue("warehouseCode") as string;
            const value = row.getValue("warehouseName")
            return (
              <div className=" uppercase">
                <Link to={r.toDetailWarehouse(code)}>
                  <Typography className=" text-primary underline cursor-pointer">
                    {typeof value == "string" ? value : "-"}
                  </Typography>
                </Link>
              </div>
            );
          },
    },
    {
        accessorKey:"Stock",
        header:t("stock"),
        cell:TableCellQuantity
    },
    {
        accessorKey:"OutOfStockThreshold",
        header:t("form.outOfStockThreshold"),
        cell:TableCellQuantity
    },
    {
        accessorKey: "CreatedAt",
        header: t("table.createdAt"),
        cell:({...props})=><TableCellDate     
        i18n={i18n}
        {...props}
        />
    },
    {
      accessorKey: "Enabled",
      header: t("form.enabled"),
      cell:TableCellBoolean
    },
    {
        id: "actions",
        cell:DataTableRowActions
      },
  ];
};
