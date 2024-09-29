import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { routes } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { z } from "zod";
import { orderLineSchema } from "~/util/data/schemas/buying/purchase-schema";
import TableCellPrice from "../../cells/table-cell-price";
import TableCellIndex from "../../cells/table-cell-index";
import { formatTax, getTaxPorcent } from "~/util/format/formatCurrency";

export const  orderLineColumns = ({
  currency,
}: {
  currency?: string;
}): ColumnDef<z.infer<typeof orderLineSchema>>[] => {
  let columns: ColumnDef<z.infer<typeof orderLineSchema>>[] = [];
  const r = routes;
  const { t, i18n } = useTranslation("common");
  columns.push({
    header:t("table.no"),
    cell:TableCellIndex
  })
  columns.push({
    accessorKey: "item_price.item_code",
    header: t("_item.code"),
  });
  columns.push({
    accessorKey: "item_price.item_name",
    header: t("form.name"),
  });
  columns.push({
    accessorKey: "item_price.uom",
    header: t("form.uom"),
  });
  columns.push({
    accessorKey: "quantity",
    header: t("_item.quantity"),
  });

  columns.push({
    accessorKey: "amount",
    header: t("form.amount"),
    cell: ({ ...props }) => {
      return currency ? (
        <TableCellPrice {...props} currency={currency} i18n={i18n} />
      ) : (
        "-"

      );
    },
  });

  columns.push({
    accessorKey: "amount",
    header: t("form.tax"),
    cell: ({ ...props }) => {
      const rowData = props.row.original
      const taxPrice = getTaxPorcent(rowData.item_price.tax_value,rowData.item_price.rate,currency,i18n.language)
      return currency ? (
        <TableCellPrice {...props} currency={currency} i18n={i18n} price={taxPrice}/>
      ) : (
        "-"
      );
    },
  });
  // columns.push({
  //     id: "actions-row",
  //     cell: DataTableRowActions,
  //   })
  return [...columns];
};


//FOR DISPLAY ITEM LINES IN ORDERS,INVOICE AND RECEIPT
export const displayItemLineColumns = ({
  currency,
}: {
  currency?: string;
}): ColumnDef<components["schemas"]["ItemLineDto"]>[] => {
  let columns: ColumnDef<components["schemas"]["ItemLineDto"]>[] = [];
  const r = routes;
  const { t, i18n } = useTranslation("common");
  columns.push({
    header:t("table.no"),
    cell:TableCellIndex
  })
  columns.push({
    accessorKey: "item_code",
    header: t("_item.code"),
  });
  columns.push({
    accessorKey: "item_name",
    header: t("form.name"),
  });
  columns.push({
    accessorKey: "uom",
    header: t("form.uom"),
  });
  columns.push({
    accessorKey: "quantity",
    header: t("_item.quantity"),
  });

  columns.push({
    accessorKey: "amount",
    header: t("form.amount"),
    cell: ({ ...props }) => {
      return currency ? (
        <TableCellPrice {...props} currency={currency} i18n={i18n} />
      ) : (
        "-"

      );
    },
  });

  columns.push({
    accessorKey: "amount",
    header: t("form.tax"),
    cell: ({ ...props }) => {
      const rowData = props.row.original
      const taxPrice = getTaxPorcent(rowData.tax_value,rowData.item_price_rate,currency,i18n.language)
      return currency ? (
        <TableCellPrice {...props} currency={currency} i18n={i18n} price={taxPrice}/>
      ) : (
        "-"
      );
    },
  });
  // columns.push({
  //     id: "actions-row",
  //     cell: DataTableRowActions,
  //   })
  return [...columns];
};
