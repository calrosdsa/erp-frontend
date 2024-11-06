import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { routes } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellPrice from "../../cells/table-cell-price";

export const accountPayableColumns = ({}: {}): ColumnDef<
  components["schemas"]["AccountPayableEntryDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["AccountPayableEntryDto"]>[] =
    [];
  const r = routes;
  const { t, i18n } = useTranslation("common");
  columns.push({
    accessorKey: "posting_date",
    header: t("form.postingDate"),
    size: 300,
    cell: ({ ...props }) => {
      return <TableCellDate i18n={i18n} formatDate="medium" {...props} />;
    },
  });
  columns.push({
    accessorKey: "party_type",
  });

  columns.push({
    accessorKey: "party_name",
  });
  columns.push({
    accessorKey: "receivable_account",
    header: t("payableAccount"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <>
          <span className="truncate">{rowData.receivable_account}</span>
        </>
      );
    },
  });
  columns.push({
    accessorKey: "voucher_type",
  });
  columns.push({
    accessorKey: "voucher_no",
  });
  columns.push({
    accessorKey: "invoiced_amount",
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellPrice i18n={i18n} currency={rowData.currency} {...props} />
      );
    },
  });
  columns.push({
    accessorKey: "paid_amount",
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
          price={rowData.paid_amount - rowData.invoiced_amount}
          {...props}
        />
      );
    },
  });

  return [...columns];
};
