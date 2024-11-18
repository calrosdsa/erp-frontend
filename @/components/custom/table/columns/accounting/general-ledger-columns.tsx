import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { routes } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellPrice from "../../cells/table-cell-price";

export const generalLedgerColumns = ({}: {}): ColumnDef<
  components["schemas"]["GeneralLedgerEntryDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["GeneralLedgerEntryDto"]>[] = [];
  const r = routes;
  const { t, i18n } = useTranslation("common");
  columns.push({
    accessorKey: "posting_date",
    header: t("form.postingDate"),
    cell: ({ ...props }) => {
      return <TableCellDate i18n={i18n} formatDate="medium" {...props} />;
    },
  });
  columns.push({
    accessorKey: "account",
    header: t("account"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <>
          <span className="truncate">{rowData.account}</span>
        </>
      );
    },
  });
  columns.push({
    accessorKey: "debit",
    header: t("form.debit"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellPrice i18n={i18n} currency={rowData.currency} {...props} />
      );
    },
  });
  columns.push({
    accessorKey: "credit",
    header: t("form.credit"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellPrice i18n={i18n} currency={rowData.currency} {...props} />
      );
    },
  });
  columns.push({
    accessorKey: "balance",
    header: t("form.balance"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellPrice i18n={i18n} currency={rowData.currency} {...props} />
      );
    },
  });
  columns.push({
    accessorKey: "voucher_type",
    header: t("form.voucherType"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return <div>{t(rowData.voucher_type)} </div>;
    },
  });

  columns.push({
    accessorKey: "voucher_subtype",
    header: t("form.voucherSubtype"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return <div>{t(rowData.voucher_subtype)} </div>;
    },
  });
  columns.push({
    accessorKey: "voucher_no",
    header: t("form.voucherNo"),
  });

  columns.push({
    accessorKey: "against_account",
    header: t("form.againstAccount"),
  });

  columns.push({
    accessorKey: "party_type",
    header: t("form.partyType"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return <div>{t(rowData.party_type)} </div>;
    },
  });

  columns.push({
    accessorKey: "party_name",
    header: t("form.partyName"),
  });

  // columns.push({
  //     accessorKey: "against_voucher_type",
  // });

  // columns.push({
  //     accessorKey: "against_voucher",
  // });

  return [...columns];
};
