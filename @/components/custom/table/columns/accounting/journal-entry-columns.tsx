import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { route } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";
import { journalEntryLineSchema } from "~/util/data/schemas/accounting/journal-entry-schema";
import TableCellPrice from "../../cells/table-cell-price";
import { z } from "zod";
import { DataTableRowActions } from "../../data-table-row-actions";
import { formatCurrencyAmount } from "~/util/format/formatCurrency";
import TableCellTranslate from "../../cells/table-cell-translate";
import { OpenModalFunc } from "~/types";
import { TableCellBase } from "../../cells/table-cell";
import TableCellEditable from "../../cells/table-cell-editable";
import {
  LedgerAutcomplete,
} from "~/util/hooks/fetchers/use-account-ledger-fetcher";
import { CostCenterAutocomplete } from "~/util/hooks/fetchers/accounting/use-cost-center-fetcher";
import { ProjectAutocomplete } from "~/util/hooks/fetchers/accounting/use-project-fetcher";

export const journalEntryColumns = ({
  openModal,
}: {
  openModal: OpenModalFunc;
}): ColumnDef<components["schemas"]["JournalEntryDto"]>[] => {
  let columns: ColumnDef<components["schemas"]["JournalEntryDto"]>[] = [];
  const r = route;
  const { t, i18n } = useTranslation("common");
  return [
    {
      accessorKey: "code",
      header: t("form.code"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellBase
            className="font-semibold underline cursor-pointer"
            {...props}
            onClick={() => {
              openModal(route.journalEntry, rowData.code);
            }}
          />
        );
      },
    },
    {
      accessorKey: "entry_type",
      header: t("form.type"),
      cell: ({ ...props }) => {
        return <TableCellTranslate {...props} t={t} />;
      },
    },
    {
      accessorKey: "status",
      header: t("form.status"),
      cell: TableCellStatus,
    },
    {
      accessorKey: "posting_date",
      header: t("form.postingDate"),
      cell: ({ ...props }) => {
        return <TableCellBase {...props} cellType="date" />;
      },
    },
  ];
};

export const journalEntryLineColumns = ({
  allowEdit,
}: {
  allowEdit: boolean;
}): ColumnDef<z.infer<typeof journalEntryLineSchema>>[] => {
  let columns: ColumnDef<z.infer<typeof journalEntryLineSchema>>[] = [];
  const r = route;
  const { t, i18n } = useTranslation("common");

  columns.push({
    accessorKey: "accountName",
    header: t("_ledger.base"),
    size: 200,
    cell: ({ ...props }) => {
      const tableMeta: any = props.table.options.meta;  
      return (
        <>
          <LedgerAutcomplete
            defaultValue={props.row.original.accountName}
            allowEdit={!tableMeta?.disableEdit}
            onSelect={(e) => {
              tableMeta?.updateCell(props.row.index, "accountName", e.name);
              tableMeta?.updateCell(props.row.index, "accountID", e.id);
              tableMeta?.updateCell(props.row.index, "currency", e.currency);
              tableMeta?.updateCell(props.row.index, "debit", 0);
              tableMeta?.updateCell(props.row.index, "credit", 0);
            }}
          />
          {/* <Autocomplete
            defaultValue={props.row.original.accountName}
            onValueChange={onChange}
            data={fetcher.data?.results || []}
            nameK={"name"}
            placeholder="Buscar o crear un nueva cuenta"
            onSelect={(e) => {
              tableMeta?.updateCell(props.row.index, "accountName", e.name);
              tableMeta?.updateCell(props.row.index, "accountID", e.id);
              tableMeta?.updateCell(props.row.index, "currency", e.currency);
              tableMeta?.updateCell(props.row.index, "debit", 0);
              tableMeta?.updateCell(props.row.index, "credit", 0);
            }}
          /> */}
        </>
      );
    },
  });
  columns.push({
    accessorKey: "costCenterName",
    header: t("costCenter"),
    cell: ({ ...props }) => {
      const tableMeta: any = props.table.options.meta;
      return (
        <CostCenterAutocomplete
          defaultValue={props.row.original.costCenterName}
          allowEdit={!tableMeta?.disableEdit}
          onSelect={(e) => {
            tableMeta?.updateCell(props.row.index, "costCenterName", e.name);
            tableMeta?.updateCell(props.row.index, "costCenterID", e.id);
          }}
        />
      );
    },
  });

  columns.push({
    accessorKey: "projectName",
    header: t("project"),
    cell: ({ ...props }) => {
      const tableMeta: any = props.table.options.meta;
      return (
        <ProjectAutocomplete
          defaultValue={props.row.original.projectName}
          allowEdit={!tableMeta?.disableEdit}
          onSelect={(e) => {
            tableMeta?.updateCell(props.row.index, "projectName", e.name);
            tableMeta?.updateCell(props.row.index, "projectID", e.id);
          }}
        />
      );
    },
  });

  columns.push({
    accessorKey: "debit",
    size: 100,
    header: t("form.debit"),
    cell: TableCellEditable,
    meta: {
      type: "number",
    },
  });
  columns.push({
    accessorKey: "credit",
    size: 100,
    header: t("form.credit"),
    cell: TableCellEditable,
    meta: {
      type: "number",
    },
  });

  // columns.push({
  //   accessorKey: "debit",
  //   header: t("form.debit"),
  //   cell: ({ ...props }) => {
  //     const rowData = props.row.original;
  //     return (
  //       <div>
  //         {formatCurrencyAmount(rowData.debit, rowData.currency, i18n.language)}
  //       </div>
  //     );
  //   },
  // });

  // columns.push({
  //   accessorKey: "credit",
  //   header: t("form.credit"),
  //   cell: ({ ...props }) => {
  //     const rowData = props.row.original;
  //     return (
  //       <div>
  //         {formatCurrencyAmount(
  //           rowData.credit,
  //           rowData.currency,
  //           i18n.language
  //         )}
  //       </div>
  //     );
  //   },
  // });

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
