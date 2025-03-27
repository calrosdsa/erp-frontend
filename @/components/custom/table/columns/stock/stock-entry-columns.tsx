import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { route } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";

export const stockEntryColumns = ({}: {}): ColumnDef<
  components["schemas"]["StockEntryDto"]
>[] => {
  const r = route;
  const { t, i18n } = useTranslation("common");
  return [
    {
      accessorKey: "code",
      header: t("form.code"),
      cell: ({ ...props }) => {
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(code) =>
              r.toRouteDetail(r.stockEntry, code, {
                tab: "info",
              })
            }
          />
        );
      },
    },
    {
      accessorKey: "status",
      header: t("form.status"),
      cell: TableCellStatus,
    },
  ];
};
