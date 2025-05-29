import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { route } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellPrice from "../../cells/table-cell-price";

export const accountPayableSumaryColumns = ({}: {}): ColumnDef<
  components["schemas"]["SumaryEntryDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["SumaryEntryDto"]>[] =
    [];
  const r = route;
  const { t, i18n } = useTranslation("common");
  
  columns.push({
    accessorKey: "party_type",
    header:t("form.party"),
    cell:({...props})=>{
      const rowData = props.row.original
      return <div>{t(rowData.party_type)} </div>
    }
  });

  columns.push({
    accessorKey: "party_name",
    header:t("form.name"),
    cell:({...props})=>{
      const rowData = props.row.original
      return <TableCellNameNavigation
      navigate={(name)=>r.toRoute({
        main:rowData.party_type,
        routePrefix:[r.buyingM],
        routeSufix:[name],
        q:{
          tab:"info",
          id:rowData.party_uuid,
        }
      })}
      {...props}
      />
    }
  });
  
  
  columns.push({
    accessorKey: "total_invoiced_amount",
    header:t("form.invoiceAmount"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellPrice i18n={i18n} currency={rowData.currency} {...props} />
      );
    },
  });
  columns.push({
    accessorKey: "total_paid_amount",
    header:t("form.paidAmount"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellPrice i18n={i18n} currency={rowData.currency} {...props} />
      );
    },
  });
  columns.push({
    id: "outstandingAmount",
    header: t("form.outstandingAmount"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellPrice
          i18n={i18n}
          currency={rowData.currency}
          price={rowData.total_invoiced_amount - rowData.total_paid_amount}
          {...props}
        />
      );
    },
  });

  return [...columns];
};
