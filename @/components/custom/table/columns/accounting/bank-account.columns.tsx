import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import { route } from "~/util/route";
import TableCellStatus from "../../cells/table-cell-status";

export const BankAccountColumns = (): ColumnDef<
  components["schemas"]["BankAccountDto"]
>[] => {
  const { t, i18n } = useTranslation("common");
  return [
    {
        accessorKey: "account_name",
        header: t("form.name"),
        size:250,
        cell: ({ ...props }) => {
            const rowData = props.row.original
          return (
            <TableCellNameNavigation
              {...props}
              navigate={(name) =>
                route.toRoute({
                  main: route.bankAccount,
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
      }
  ]
  

};
