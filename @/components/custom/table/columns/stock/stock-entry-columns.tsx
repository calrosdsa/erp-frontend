import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";

export const stockEntryColumns = ({}: {}): ColumnDef<
  components["schemas"]["StockEntryDto"]
>[] => {
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
                main: r.stockEntry,
                routePrefix: [r.stockM],
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
      accessorKey: "status",
      header: t("form.status"),
      cell: TableCellStatus,
    },
  ];
};
