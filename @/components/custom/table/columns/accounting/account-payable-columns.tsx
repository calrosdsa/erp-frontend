import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { route } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellPrice from "../../cells/table-cell-price";

export const accountPayableColumns = ({}: {}): ColumnDef<
  components["schemas"]["AccountPayableEntryDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["AccountPayableEntryDto"]>[] =
    [];
  const r = route;
  const { t, i18n } = useTranslation("common");
  columns.push({
    accessorKey: "posting_date",
    header: t("form.postingDate"),
    cell: ({ ...props }) => {
      return <TableCellDate i18n={i18n} formatDate="medium" {...props} />;
    },
  });
  columns.push({
    accessorKey: "party_type",
    header:t("form.partyType"),
    cell:({...props})=>{
      const rowData = props.row.original
      return <div>{t(rowData.party_type)} </div>
    }
  });

  columns.push({
    accessorKey: "party_name",
    header:t("form.partyName"),
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
    accessorKey: "receivable_account",
    header: t("form.payableAccount"),
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
    header:t("form.voucherType"),
  });
  columns.push({
    accessorKey: "voucher_no",
    header:t("form.voucherNo"),
    cell:({...props})=>{
      const rowData = props.row.original
      return <TableCellNameNavigation
      {...props}
      navigate={(name)=>r.toVoucher(rowData.voucher_type,name)}
      />
    }
  });
  columns.push({
    accessorKey: "invoiced_amount",
    header:t("form.invoiceAmount"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellPrice i18n={i18n} currency={rowData.currency} {...props} />
      );
    },
  });
  columns.push({
    accessorKey: "paid_amount",
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
          price={rowData.invoiced_amount - rowData.paid_amount}
          {...props}
        />
      );
    },
  });

  return [...columns];
};
