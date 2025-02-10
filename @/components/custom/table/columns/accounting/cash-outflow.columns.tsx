import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { route } from "~/util/route";
import TableCellStatus from "../../cells/table-cell-status";

export const CashOutflowColumns = (): ColumnDef<
  components["schemas"]["CashOutflowDto"]
>[] => {
  const { t, i18n } = useTranslation("common");
  return [
    {
        accessorKey: "code",
        header: t("form.name"),
        size:250,
        cell: ({ ...props }) => {
            const rowData = props.row.original
          return (
            <TableCellNameNavigation
              {...props}
              navigate={(code) =>
                route.toRoute({
                  main: route.cashOutflow,
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
      }
  ]
  

};
