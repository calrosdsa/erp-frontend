import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";

export const serialNoColumns = ({}: {}): ColumnDef<
  components["schemas"]["SerialNoDto"]
>[] => {
  const r = routes;
  const { t, i18n } = useTranslation("common");
  return [
    {
      header: t("table.no"),
      cell: TableCellIndex,
    },
    {
      accessorKey: "serial_no",
      header: t("serialNo"),
      cell: ({ ...props }) => {
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.serialNo,
                routePrefix:[r.stockM],
                routeSufix: [name],
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
