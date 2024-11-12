import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { routes } from "~/util/route-admin";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";

export const entityColumns = (): ColumnDef<
  components["schemas"]["EntityDto"]
>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return [
    {
      header: t("table.no"),
      cell: TableCellIndex,
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <TableCellNameNavigation
            {...props}
            navigate={(name) =>
              r.toRoute({
                main: "entity",
                routeSufix: [name],
                q: {
                  tab: "info",
                  id: rowData.id.toString(),
                },
              })
            }
          />
        );
      },
    },
  ];
};


export const actionColumns = (): ColumnDef<
  components["schemas"]["ActionDto"]
>[] => {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return [
    {
      header: t("table.no"),
      cell: TableCellIndex,
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ ...props }) => {
        const rowData = props.row.original;
        return (
          <div>
            {rowData.name}
          </div>
        );
      },
    },
  ];
};
