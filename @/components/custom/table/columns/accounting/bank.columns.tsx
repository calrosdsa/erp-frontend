import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { route } from "~/util/route";
import TableCellStatus from "../../cells/table-cell-status";

export const BankColumns = (): ColumnDef<
  components["schemas"]["BankDto"]
>[] => {
  const { t, i18n } = useTranslation("common");
  return [
    {
        accessorKey: "name",
        header: t("form.name"),
        size:250,
        cell: ({ ...props }) => {
            const rowData = props.row.original
          return (
            <TableCellNameNavigation
              {...props}
              navigate={(name) =>
                route.toRoute({
                  main: route.termsAndConditions,
                  routeSufix: [name],
                  q: {
                    tab: "info",
                    id: rowData.uuid,
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
