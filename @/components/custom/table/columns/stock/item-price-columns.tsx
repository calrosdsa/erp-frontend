import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatCurrency } from "~/util/format/formatCurrency";
import { formatLongDate } from "~/util/format/formatDate";
import TableCellDate from "../../cells/table-cell-date";
import { DEFAULT_CURRENCY } from "~/constant";
import { route } from "~/util/route";
import { PartyType, partyTypeFromJSON, partyTypeToJSON } from "~/gen/common";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { DataTableRowActions } from "../../data-table-row-actions";
import { itemPriceSchema } from "~/util/data/schemas/stock/item-price-schema";
import { z } from "zod";

export const itemPriceColumns = ({
  includeItem,
}: {
  includeItem?: boolean;
}): ColumnDef<components["schemas"]["ItemPriceDto"]>[] => {
  const { t, i18n } = useTranslation("common");
  let columns: ColumnDef<components["schemas"]["ItemPriceDto"]>[] = [];
  const r = route;
  
  if (includeItem) {
    columns.push({
      accessorKey: "item_name",
      header: t("item.code"),
      cell: ({ ...props }) => {
        const rowData =props.row.original
        return (
          <TableCellNameNavigation
          {...props}
          navigate={(e)=>r.toRoute({
            main:r.itemPrice,
            routeSufix:[rowData.item_name],
            q:{
              tab:"info",
              id:rowData.id.toString()
            }
          })}
          />
        );
      },
    });

    columns.push({ accessorKey: "item_code", id: "itemCode" });
  }

  columns.push({
    accessorKey: "rate",
    header: t("form.rate"),
    cell: ({ row }) => {
      const rowData = row.original;
      const currency = rowData.price_list_currency;
      return (
        <div className="">
          {formatCurrency(
            Number(rowData.rate),
            currency || DEFAULT_CURRENCY,
            i18n.language
          )}
        </div>
      );
    },
  });
  // columns.push({
  //   accessorKey: "price_list_currency",
  //   header:t("form.currency"),

  // });
  columns.push({
    accessorKey: "item_quantity",
    header: t("form.itemQuantity"),
  });
  columns.push({
    accessorKey: "created_at",
    header: t("table.createdAt"),
    cell: ({ ...props }) => {
      return <TableCellDate {...props} i18n={i18n} />;
    },
  });


  columns.push({
    accessorKey: "price_list_name",
    header: t("priceList"),
    cell: ({ ...props }) => {
      const rowData =props.row.original
      return (
        <TableCellNameNavigation
        {...props}
        navigate={(e)=>r.toRoute({
          main:r.priceList,
          routePrefix:[r.stockM],
          routeSufix:[e],
          q:{
            tab:"info",
            id:rowData.price_list_uuid
          }
        })}
        />
      );
    },
  });

  return columns;
};


export const itemPriceEditableColumns = (): ColumnDef<z.infer<typeof itemPriceSchema>>[] => {
  let columns: ColumnDef<z.infer<typeof itemPriceSchema>>[] = [];
  const { t, i18n } = useTranslation("common");

  // columns.push({
  //   accessorKey: "accountName",
  //   header: t("_ledger.base"),
  //   size: 200,
  //   cell: ({ ...props }) => {
  //     const tableMeta: any = props.table.options.meta;  
  //     return (
  //       <>
  //         <LedgerAutcomplete
  //           defaultValue={props.row.original.accountName}
  //           allowEdit={!tableMeta?.disableEdit}
  //           onSelect={(e) => {
  //             tableMeta?.updateCell(props.row.index, "accountName", e.name);
  //             tableMeta?.updateCell(props.row.index, "accountID", e.id);
  //             tableMeta?.updateCell(props.row.index, "currency", e.currency);
  //             tableMeta?.updateCell(props.row.index, "debit", 0);
  //             tableMeta?.updateCell(props.row.index, "credit", 0);
  //           }}
  //         />
       
  //       </>
  //     );
  //   },
  // });
  // columns.push({
  //   accessorKey: "costCenterName",
  //   header: t("costCenter"),
  //   cell: ({ ...props }) => {
  //     const tableMeta: any = props.table.options.meta;
  //     return (
  //       <CostCenterAutocomplete
  //         defaultValue={props.row.original.costCenterName}
  //         allowEdit={!tableMeta?.disableEdit}
  //         onSelect={(e) => {
  //           tableMeta?.updateCell(props.row.index, "costCenterName", e.name);
  //           tableMeta?.updateCell(props.row.index, "costCenterID", e.id);
  //         }}
  //       />
  //     );
  //   },
  // });

  // columns.push({
  //   accessorKey: "projectName",
  //   header: t("project"),
  //   cell: ({ ...props }) => {
  //     const tableMeta: any = props.table.options.meta;
  //     return (
  //       <ProjectAutocomplete
  //         defaultValue={props.row.original.projectName}
  //         allowEdit={!tableMeta?.disableEdit}
  //         onSelect={(e) => {
  //           tableMeta?.updateCell(props.row.index, "projectName", e.name);
  //           tableMeta?.updateCell(props.row.index, "projectID", e.id);
  //         }}
  //       />
  //     );
  //   },
  // });

  // columns.push({
  //   accessorKey: "debit",
  //   size: 100,
  //   header: t("form.debit"),
  //   cell: TableCellEditable,
  //   meta: {
  //     type: "number",
  //   },
  // });
  // columns.push({
  //   accessorKey: "credit",
  //   size: 100,
  //   header: t("form.credit"),
  //   cell: TableCellEditable,
  //   meta: {
  //     type: "number",
  //   },
  // });


  columns.push({
    id: "actions",
    cell: DataTableRowActions,
  });
  return [...columns];
};

