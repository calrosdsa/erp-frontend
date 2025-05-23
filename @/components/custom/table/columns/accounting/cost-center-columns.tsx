import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { route } from "~/util/route";
import TableCellIndex from "../../cells/table-cell-index";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellStatus from "../../cells/table-cell-status";

export const costCenterColumns = ({}: {}): ColumnDef<
  components["schemas"]["CostCenterDto"]
>[] => {
  let columns: ColumnDef<components["schemas"]["CostCenterDto"]>[] = [];
  const r = route;
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
                main: r.costCenter,
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
    {
      accessorKey: "status",
      header: t("form.status"),
      cell: TableCellStatus,
    },
  ];
};
