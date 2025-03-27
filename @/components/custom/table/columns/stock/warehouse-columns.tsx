import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatLongDate } from "~/util/format/formatDate";
import { route } from "~/util/route";
import TableCellDate from "../../cells/table-cell-date";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { PartyType, partyTypeToJSON } from "~/gen/common";

export const warehouseColumns = (): ColumnDef<
  components["schemas"]["WareHouseDto"]
>[] => {
  const { t, i18n } = useTranslation("common");
  const r = route;
  let columns: ColumnDef<components["schemas"]["WareHouseDto"]>[] = [];
  columns.push({
    accessorKey: "name",
    header: t("warehouse"),
    cell: ({ ...props }) => {
      const rowData = props.row.original;
      return (
        <TableCellNameNavigation
          {...props}
          navigate={(name) =>
            r.toRouteDetail(route.warehouse, name, {
              tab: "info",
              id: rowData.id.toString(),
            })
          }
        />
      );
    },
  });

  columns.push({
    accessorKey: "created_at",
    header: t("table.createdAt"),
    cell: ({ ...props }) => <TableCellDate {...props} i18n={i18n} />,
  });

  return columns;
};
