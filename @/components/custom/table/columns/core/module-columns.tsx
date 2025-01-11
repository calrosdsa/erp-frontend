
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";
import { parties } from "~/util/party";

export const moduleColumns = ({}: {}): ColumnDef<
  components["schemas"]["ModuleDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["ModuleDto"]>[] = [];
  const r = routes;
  const p = parties
  const { t, i18n } = useTranslation("common");
  return [
    {
      accessorKey: "name",
      header: t("form.name"),
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: r.p.module,
                routeSufix: [name],
                q: {
                  tab: "info",
                  id: rowData.,
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
    {
      accessorKey: "from_currency",
      header: "Moneda de origin",
    },
    {
      accessorKey: "to_currency",
      header: "Moneda de partida",
    },
  ];
};
