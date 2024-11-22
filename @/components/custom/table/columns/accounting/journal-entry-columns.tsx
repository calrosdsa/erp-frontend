import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";
import { journalEntryLineSchema } from "~/util/data/schemas/accounting/journal-entry-schema";
import TableCellPrice from "../../cells/table-cell-price";
import { z } from "zod";
import { DataTableRowActions } from "../../data-table-row-actions";
import { formatCurrencyAmount } from "~/util/format/formatCurrency";
import TableCellTranslate from "../../cells/table-cell-translate";

export const journalEntryColumns = ({}: {}): ColumnDef<
  components["schemas"]["JournalEntryDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["JournalEntryDto"]>[] = [];
  const r = routes;
  const { t, i18n } = useTranslation("common");
  return [
    {
      header: t("table.no"),
      cell: TableCellIndex,
    },
    {
      accessorKey: "code",
      header: t("form.code"),
      cell: ({ ...props }) => {
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(code) =>
              r.toRoute({
                main: r.journalEntry,
                routePrefix: [r.accountingM],
                routeSufix: [code],
                q: {
                  tab: "info",
                },
              })
            }
          />
        );
      },
    },
    {
      accessorKey: "entry_type",
      header: t("form.type"),
      cell: ({...props})=>{
        return <TableCellTranslate
        {...props}
        t={t}
        />
      },
    },
    {
      accessorKey: "status",
      header: t("form.status"),
      cell: TableCellStatus,
    },
  ];
};

export const journalEntryLineColumns = (): ColumnDef<
  z.infer<typeof journalEntryLineSchema>
>[] => {
  let columns: ColumnDef<z.infer<typeof journalEntryLineSchema>>[] = [];
  const r = routes;
  const { t, i18n } = useTranslation("common");
  columns.push({
    header: t("table.no"),
    cell: TableCellIndex,
  });
  columns.push({
    accessorKey: "accountName",
    header: t("_ledger.base"),
  });
  columns.push({
    accessorKey: "costCenterName",
    header: t("costCenter"),
  });

  columns.push({
    accessorKey: "debit",
    header: t("form.debit"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <div>
          {formatCurrencyAmount(
            rowData.debit,
            rowData.currency,
            i18n.language
          )}
        </div>
      );
    },
  });

  columns.push({
    accessorKey: "credit",
    header: t("form.credit"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <div>
          {formatCurrencyAmount(
            rowData.credit,
            rowData.currency,
            i18n.language
          )}
        </div>
      );
    },
  });

  columns.push({
    id: "actions",
    cell: DataTableRowActions,
  });

  // columns.push({
  //   accessorKey: "amount",
  //   header: t("form.tax"),
  //   cell: ({ ...props }) => {
  //     const rowData = props.row.original
  //     const taxPrice = getTaxPorcent(rowData.item_price.tax_value,rowData.item_price.rate,currency,i18n.language)
  //     return currency ? (
  //       <TableCellPrice {...props} currency={currency} i18n={i18n} price={taxPrice}/>
  //     ) : (
  //       "-"
  //     );
  //   },
  // });

  // columns.push({
  //     id: "actions-row",
  //     cell: DataTableRowActions,
  //   })
  return [...columns];
};
