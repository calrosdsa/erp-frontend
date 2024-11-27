import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { taxAndChargeSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellPrice from "../../cells/table-cell-price";
import { DataTableRowActions } from "../../data-table-row-actions";

export const  taxAndChargesColumns = ({
    currency,
  }: {
    currency?: string;
  }): ColumnDef<z.infer<typeof taxAndChargeSchema>>[] => {
    let columns: ColumnDef<z.infer<typeof taxAndChargeSchema>>[] = [];
    const { t, i18n } = useTranslation("common");
    columns.push({
      header:t("table.no"),
      cell:TableCellIndex
    })
    columns.push({
      accessorKey: "type",
      header: t("form.type"),
    });
    columns.push({
      accessorKey: "accountHeadName",
      header: t("form.name"),
    });
  
    columns.push({
      accessorKey: "amount",
      header: t("form.rate"),
      cell: ({...props})=>{
        return currency ? (
          <TableCellPrice {...props}  currency={currency} i18n={i18n}/>
        ): (
          "-"
        );
      },
    });
  
    columns.push({
      accessorKey: "totalAmount",
      header: t("form.amount"),
      cell: ({ ...props }) => {
        const rowData = props.row.original
        return currency ? (
            <TableCellPrice {...props}  currency={currency} i18n={i18n}/>
        ) : (
          "-"
        );
      },
    });
  
    columns.push({
        id: "actions",
        cell: DataTableRowActions,
    })
  
  
    return [...columns];
  };
  