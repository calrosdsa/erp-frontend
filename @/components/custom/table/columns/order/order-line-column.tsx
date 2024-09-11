import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { routes } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { z } from "zod";
import { orderLineSchema } from "~/util/data/schemas/buying/purchase-schema";
import TableCellPrice from "../../cells/table-cell-price";

export const orderLineColumns = ({
  currency,
}: {
  currency?: string;
}): ColumnDef<z.infer<typeof orderLineSchema>>[] => {
  let columns: ColumnDef<z.infer<typeof orderLineSchema>>[] = [];
  const r = routes;
  const { t, i18n } = useTranslation("common");
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
  // columns.push({
  //     id: "actions-row",
  //     cell: DataTableRowActions,
  //   })
  return [...columns];
};
